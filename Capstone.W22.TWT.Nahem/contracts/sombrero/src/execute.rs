use cosmwasm_std::Uint128;
use cosmwasm_std::{
    from_binary, to_binary, Addr, CosmosMsg, DepsMut, Env, MessageInfo, Response, WasmMsg,
};
use cw20::{Cw20ExecuteMsg, Cw20ReceiveMsg};
use cw721::NumTokensResponse;
use cw721_metadata_onchain::{Extension, Metadata, MintMsg, Trait};

use crate::msg::ReceiveMsg;
use crate::state::{Hacks, HACKS};
use crate::{
    state::{Config, Subscriptions, CONFIG, SUBSCRIPTIONS},
    ContractError,
};

pub type Cw721ExecuteMsg = cw721_metadata_onchain::ExecuteMsg;
pub type Cw721QueryMsg = cw721_metadata_onchain::QueryMsg;

/// smart contract owners can subscribe their contracts to the protocol to have them protected.
/// subscriber is the address of the contract to be protected
/// bounty_pct is the percentage of the amount hacked that will be paid to the hacker as reward
/// min_bounty is the minimum amount of tokens that the hacker will receive as reward for hacking the contract
///
pub fn subscribe(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    subscriber: String,
    bounty_pct: Uint128,
    min_bounty: Option<Uint128>,
) -> Result<Response, ContractError> {
    if bounty_pct > Uint128::from(100u128) {
        return Err(ContractError::InvalidBountyPercentage {});
    }
    //validate that subscriber is a valid address
    let valid_subscriber = deps.api.addr_validate(&subscriber)?;
    // save subscription details on state
    let subscriptions = Subscriptions {
        subscriber: valid_subscriber.clone(),
        bounty_pct,
        min_bounty,
    };
    SUBSCRIPTIONS.save(deps.storage, valid_subscriber.clone(), &subscriptions)?;

    Ok(Response::new()
        .add_attribute("action", "subscribe")
        .add_attribute("subscriber", valid_subscriber)
        .add_attribute("bounty_pct", bounty_pct.to_string())
        .add_attribute(
            "min_bounty",
            min_bounty.unwrap_or(Uint128::zero()).to_string(),
        ))
}

/// smart contract owners can unsubscribe their contracts from the protocol to stop participating in the bounty program
///
pub fn unsubscribe(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    subscriber: String,
) -> Result<Response, ContractError> {
    let subscription = SUBSCRIPTIONS.load(deps.storage, deps.api.addr_validate(&subscriber)?)?;
    if info.sender != subscription.subscriber {
        return Err(ContractError::Unauthorized {});
    }

    SUBSCRIPTIONS.remove(deps.storage, info.sender.clone());
    Ok(Response::new()
        .add_attribute("action", "unsubscribe")
        .add_attribute("unsubscribed", info.sender))
}

/// hackers send hacked cw20 tokens to the contract to claim their bounty
/// they have to include the address of the contract they hacked in the DepositCw20 message
/// then the contract will call the deposit_cw20 function to handle the bounty payment.
///
pub fn handle_receive_cw20(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    cw20_msg: Cw20ReceiveMsg,
) -> Result<Response, ContractError> {
    // validate that cw20 contract is sending this message
    //

    let hacker_addr = deps.api.addr_validate(&cw20_msg.sender)?;
    let cw20_addr = info.sender.clone();
    let msg: ReceiveMsg = from_binary(&cw20_msg.msg)?;

    match msg {
        ReceiveMsg::DepositCw20 { subscriber } => deposit_cw20(
            deps,
            env,
            subscriber,
            hacker_addr,
            cw20_addr,
            cw20_msg.amount,
        ),
    }
}

/// deposit_cw20 will calculate the bounty amount and send it to the hacker.
/// it will also send the remaining funds to the contract owner after deducting the protocol fee
/// and mint an NFT to the hacker address with the hack details.
/// aditionally, the contract will store hack details in state.
///
pub fn deposit_cw20(
    deps: DepsMut,
    env: Env,
    subscriber: String,
    hacker_addr: Addr,
    cw20_addr: Addr,
    amount: Uint128,
) -> Result<Response, ContractError> {
    let subscriber = deps.api.addr_validate(&subscriber)?;
    let subscription = SUBSCRIPTIONS.load(deps.storage, subscriber.clone())?;
    let bounty: Uint128 = Uint128::from(
        subscription
            .bounty_pct
            .u128()
            .checked_mul(amount.u128())
            .ok_or(ContractError::Overflow {})?
            / 100u128,
    );
    let cfg = CONFIG.load(deps.storage)?;
    let mut messages = Vec::new();
    let config = CONFIG.load(deps.storage)?;
    let cw721_addr = config.cw721_addr;

    // transfer bounty to hacker as a message
    messages.push(CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: cw20_addr.to_string(),
        msg: to_binary(&Cw20ExecuteMsg::Transfer {
            recipient: hacker_addr.to_string(),
            amount: bounty.into(),
        })?,
        funds: vec![],
    }));

    // transfer remaining funds to suscriber as a message
    messages.push(CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: cw20_addr.to_string(),
        msg: to_binary(&Cw20ExecuteMsg::Transfer {
            recipient: subscription.subscriber.to_string(),
            amount: (amount
                .u128()
                .checked_sub(bounty.u128())
                .ok_or(ContractError::Underflow {})?
                .checked_sub(
                    amount
                        .u128()
                        .checked_mul(cfg.protocol_fee.u128())
                        .ok_or(ContractError::Overflow {})?
                        / 100,
                )
                .ok_or(ContractError::Underflow {})?)
            .into(),
        })?,
        funds: vec![],
    }));

    // create NFT metadata with hack details
    let traits: Vec<Trait> = vec![
        Trait {
            display_type: None,
            trait_type: "date".to_string(),
            value: env.block.time.seconds().to_string(),
        },
        Trait {
            display_type: None,
            trait_type: "contract_exploited".to_string(),
            value: cw20_addr.to_string(),
        },
        Trait {
            display_type: None,
            trait_type: "total_amount_hacked".to_string(),
            value: amount.to_string(),
        },
        Trait {
            display_type: None,
            trait_type: "bounty".to_string(),
            value: bounty.to_string(),
        },
        Trait {
            display_type: None,
            trait_type: "hacker_addr".to_string(),
            value: hacker_addr.to_string(),
        },
    ];

    // mint a new NFT with hack details to hacker's address as a message
    let metadata = Metadata {
        image: None,
        image_data: None,
        external_url: None,
        description: None,
        name: None,
        attributes: Some(traits),
        background_color: None,
        animation_url: None,
        youtube_url: None,
    };
    let num_tokens: NumTokensResponse = deps
        .querier
        .query_wasm_smart(cw721_addr.clone(), &Cw721QueryMsg::NumTokens {})?;
    messages.push(CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: cw721_addr.to_string(),
        msg: to_binary(&Cw721ExecuteMsg::Mint(MintMsg::<Extension> {
            token_id: (num_tokens
                .count
                .checked_add(1)
                .ok_or(ContractError::Overflow {}))?
            .to_string(),
            owner: hacker_addr.to_string(),
            token_uri: None,
            extension: Some(metadata),
        }))?,
        funds: vec![],
    }));

    // update hack details and save them in storage
    let hacks = Hacks {
        date: env.block.time.seconds(),
        contract_exploited: cw20_addr,
        total_amount_hacked: amount,
        bounty: bounty.into(),
        hacker_addr: hacker_addr.clone(),
    };
    HACKS.save(deps.storage, (hacker_addr, hacks.date), &hacks)?;

    Ok(Response::new()
        .add_attribute("action", "deposit_cw20")
        .add_messages(messages))
}

/// withdraw will transfer the contract's cw20 tokens earned as protocol fees to the recipient
/// or to the contract owner if no recipient is specified. This can only be called by the contract owner.
///
pub fn withdraw(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    cw20_addr: String,
    amount: Uint128,
    recipient: Option<String>,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    if info.sender != config.contract_owner {
        return Err(ContractError::Unauthorized {});
    }
    if amount.is_zero() {
        return Err(ContractError::NothingToWithdraw {});
    }
    let recipient = deps
        .api
        .addr_validate(&recipient.unwrap_or(config.contract_owner.to_string()))?;

    // transfer cw20 tokens to recipient as a message
    let tx_msg = Cw20ExecuteMsg::Transfer {
        recipient: recipient.to_string(),
        amount: Uint128::from(amount),
    };
    let msg = WasmMsg::Execute {
        contract_addr: cw20_addr,
        msg: to_binary(&tx_msg)?,
        funds: vec![],
    };

    Ok(Response::new()
        .add_attribute("action", "withdraw")
        .add_attribute("amount", amount.to_string())
        .add_attribute("recipient", recipient)
        .add_message(msg))
}

/// update_subscription allows a subscriber to update their subscription details.
/// This can only be called by the subscriber.
///
pub fn update_subscription(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    subscriber: String,
    new_bounty_pct: Option<Uint128>,
    new_min_bounty: Option<Uint128>,
) -> Result<Response, ContractError> {
    if info.sender != deps.api.addr_validate(&subscriber)? {
        return Err(ContractError::Unauthorized {});
    }
    let subscriptions = SUBSCRIPTIONS.load(deps.storage, info.sender.clone())?;

    if new_bounty_pct.is_none() && new_min_bounty == subscriptions.min_bounty
        || new_min_bounty.is_none() && new_bounty_pct == Some(subscriptions.bounty_pct)
        || new_bounty_pct.is_none() && new_min_bounty.is_none()
    {
        return Err(ContractError::NothingToUpdate {});
    }

    if new_bounty_pct > Some(Uint128::from(100u128)) {
        return Err(ContractError::InvalidBountyPercentage {});
    }

    let subscriptions = Subscriptions {
        subscriber: subscriptions.subscriber,
        bounty_pct: new_bounty_pct.unwrap_or(subscriptions.bounty_pct),
        min_bounty: new_min_bounty,
    };
    SUBSCRIPTIONS.save(deps.storage, info.sender, &subscriptions)?;

    Ok(Response::new().add_attribute("action", "update_subscription"))
}

/// update_config allows the contract owner to update the contract owner and/or the protocol fee.
/// This can only be called by the contract owner.
/// The protocol fee is a percentage of the total amount hacked that is paid to the contract owner.
///
pub fn update_config(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    new_contract_owner: Option<String>,
    new_protocol_fee: Option<Uint128>,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;

    if info.sender != config.contract_owner {
        return Err(ContractError::Unauthorized {});
    }

    if new_contract_owner.is_none() && new_protocol_fee.is_none() {
        return Err(ContractError::NothingToUpdate {});
    }

    if new_contract_owner == Some(config.contract_owner.to_string())
        && new_protocol_fee == Some(config.protocol_fee)
    {
        return Err(ContractError::NothingToUpdate {});
    }

    if new_protocol_fee > Some(Uint128::from(100u128)) {
        return Err(ContractError::InvalidProtocolFee {});
    }

    let val_new_contract_owner = deps
        .api
        .addr_validate(&new_contract_owner.unwrap_or(config.contract_owner.to_string()));

    let config = Config {
        contract_owner: val_new_contract_owner?,
        protocol_fee: new_protocol_fee.unwrap_or(config.protocol_fee),
        cw721_addr: config.cw721_addr,
    };
    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new().add_attribute("action", "update_config"))
}
