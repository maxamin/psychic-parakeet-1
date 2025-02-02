use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Uint128};
use cw20::Cw20ReceiveMsg;

/// InstantiateMsg is the struct to instantiate the main contract, which in turn instantiates the cw721 contract
/// so we need to pass all the cw721 parameters needed for the instantiation.
/// The cw721 contract will be instantiated with the contract address as minter.
///
#[cw_serde]
pub struct InstantiateMsg {
    pub protocol_fee: Uint128,
    pub cw721_code_id: u64,
    pub cw721_name: String,
    pub cw721_symbol: String,
    pub cw721_label: String,
    pub cw721_admin: Option<String>,
}
/// ExecuteMsg is the struct to handle all the messages sent to the main contract.
///
#[cw_serde]
pub enum ExecuteMsg {
    /// UpdateConfig is the struct to update the contract owner and the protocol fee.
    ///
    UpdateConfig {
        new_contract_owner: Option<String>,
        new_bounty_pct: Option<Uint128>,
    },
    /// Subscribe is the struct to subscribe to a protected contract and set the bounty details
    ///
    Subscribe {
        subscriber: String,
        bounty_pct: Uint128,
        min_bounty: Option<Uint128>,
    },
    /// UpdateSubscription is the struct to update the bounty details for a subscription.
    /// The protected address can also be updated.
    ///
    UpdateSubscription {
        subscriber: String,
        new_bounty_pct: Option<Uint128>,
        new_min_bounty: Option<Uint128>,
    },
    /// Unsubscribe is the struct to unsubscribe a protected contract and remove the bounty details.
    ///
    Unsubscribe { subscriber: String },
    /// Receive is the struct to handle the cw20 tokens sent to the contract.
    ///
    Receive(Cw20ReceiveMsg),
    /// Withdraw is the struct used to withdraw the cw20 tokens collected as protocol fees.
    /// Only the contract owner can withdraw the tokens.
    /// The tokens can be withdrawn to a specific address if provided.
    ///
    Withdraw {
        cw20_addr: String,
        amount: Uint128,
        recipient: Option<String>,
    },
}

/// QueryMsg is the struct to handle all the queries sent to the main contract.
///
#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    /// Config is the struct to query the contract configuration.
    /// That includes the contract owner, the protocol fee and the cw721 contract address.
    ///
    #[returns(ConfigResponse)]
    Config {},
    /// Subscription is the struct to query the bounty details for a given protected contract.
    ///
    #[returns(SubscriptionResponse)]
    Subscription { protected_addr: String },
    /// Subscriptions is the struct to query the bounty details for all the protected contracts.
    /// It returns a vector of SubscriptionsResponse.
    ///
    #[returns(SubscriptionsResponse)]
    Subscriptions {},
    /// Hacks is the struct to query the details of all the hacks that have been reported.
    ///
    #[returns(HacksResponse)]
    Hacks {},
}

#[cw_serde]
pub struct ConfigResponse {
    pub contract_owner: Addr,
    pub protocol_fee: Uint128,
    pub cw721_addr: Addr,
}

#[cw_serde]
pub struct SubscriptionResponse {
    pub bounty_pct: Uint128,
    pub min_bounty: Option<Uint128>,
}

#[cw_serde]
pub struct SubscriptionsResponse {
    pub subscriber: Addr,
    pub bounty_pct: Uint128,
    pub min_bounty: Option<Uint128>,
}

#[cw_serde]
pub struct HacksResponse {
    pub date: u64,
    pub contract_exploited: Addr,
    pub total_amount_hacked: Uint128,
    pub bounty: Uint128,
    pub hacker_addr: Addr,
}

/// MigrateMsg is the struct to handle all the migrations sent to the main contract in the future
///
#[cw_serde]
pub enum MigrateMsg {}

/// ReceiveMsg is the struct to handle all the messages sent to the main contract.
///
#[cw_serde]
pub enum ReceiveMsg {
    /// DepositCw20 is the struct to handle the cw20 tokens sent to the contract.
    /// The subscriber address is the address of the protected contract and must be provided in the message.
    ///
    DepositCw20 { subscriber: String },
}
