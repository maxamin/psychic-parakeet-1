use crate::{
    msg::InstantiateMsg,
    state::{Config, CONFIG},
    ContractError,
};
use cosmwasm_std::{
    to_binary, Addr, DepsMut, Empty, Env, MessageInfo, Reply, Response, SubMsg, Uint128, WasmMsg,
};
use cw2::set_contract_version;
use cw_utils::parse_reply_instantiate_data;

pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
    contract_name: &str,
    contract_version: &str,
    instantiate_cw721_reply_id: u64,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, contract_name, contract_version)?;

    if msg.protocol_fee > Uint128::from(100u128) {
        return Err(ContractError::InvalidProtocolFee {});
    }

    // save contract details in state (cw721_addr will be set later)
    let cfg = Config {
        contract_owner: deps.api.addr_validate(&info.sender.to_string())?,
        protocol_fee: msg.protocol_fee,
        cw721_addr: Addr::unchecked(""),
    };
    CONFIG.save(deps.storage, &cfg)?;

    // instantiate cw721 contract with a subMsg (handled in handle_cw721_instantiate_reply)
    let cw721_instantiate_msg = cw721_metadata_onchain::InstantiateMsg {
        name: msg.cw721_name,
        symbol: msg.cw721_symbol,
        minter: env.contract.address.to_string(),
    };
    let message = SubMsg::<Empty>::reply_on_success(
        WasmMsg::Instantiate {
            admin: msg.cw721_admin,
            code_id: msg.cw721_code_id,
            msg: to_binary(&cw721_instantiate_msg)?,
            funds: vec![],
            label: msg.cw721_label.to_string(),
        },
        instantiate_cw721_reply_id,
    );

    Ok(Response::new()
        .add_attribute("action", "instantiate")
        .add_attribute("contract_owner", cfg.contract_owner)
        .add_attribute("protocol_fee", cfg.protocol_fee.to_string())
        .add_submessage(message))
}

pub fn handle_cw721_instantiate_reply(
    deps: DepsMut,
    reply: Reply,
) -> Result<Response, ContractError> {
    let res = parse_reply_instantiate_data(reply)?;

    // update cw721_addr in the main contract state
    let cw721_addr = deps.api.addr_validate(&res.contract_address)?;
    CONFIG.update(deps.storage, |mut cfg| -> Result<_, ContractError> {
        cfg.cw721_addr = deps.api.addr_validate(&res.contract_address)?;
        Ok(cfg)
    })?;

    Ok(Response::new()
        .add_attribute("method", "instantiate_cw721_reply")
        .add_attribute("cw721_addr", cw721_addr))
}
