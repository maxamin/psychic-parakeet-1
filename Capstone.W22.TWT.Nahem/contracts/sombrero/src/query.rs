use cosmwasm_std::{Deps, Order, StdResult};

use crate::msg::{ConfigResponse, HacksResponse, SubscriptionResponse, SubscriptionsResponse};
use crate::state::{CONFIG, HACKS, SUBSCRIPTIONS};

/// Returns the contract configuration
///
pub fn config(deps: Deps) -> StdResult<ConfigResponse> {
    let cfg = CONFIG.load(deps.storage)?;

    Ok(ConfigResponse {
        contract_owner: cfg.contract_owner,
        protocol_fee: cfg.protocol_fee,
        cw721_addr: cfg.cw721_addr,
    })
}

/// Returns the bounty conditions for a given protected address
///
pub fn subscriber(deps: Deps, protected_addr: String) -> StdResult<SubscriptionResponse> {
    let subscriptions =
        SUBSCRIPTIONS.load(deps.storage, deps.api.addr_validate(&protected_addr)?)?;

    Ok(SubscriptionResponse {
        bounty_pct: subscriptions.bounty_pct,
        min_bounty: subscriptions.min_bounty,
    })
}

/// Returns the list of protected addresses and their associated bounty conditions
///
pub fn subscriptions(deps: Deps) -> StdResult<Vec<SubscriptionsResponse>> {
    let subscriptions = SUBSCRIPTIONS
        .range(deps.storage, None, None, Order::Ascending)
        .map(|item| {
            let (addr, subscriptions) = item?;
            Ok(SubscriptionsResponse {
                subscriber: addr,
                bounty_pct: subscriptions.bounty_pct,
                min_bounty: subscriptions.min_bounty,
            })
        })
        .collect::<StdResult<Vec<SubscriptionsResponse>>>()?;

    Ok(subscriptions)
}

/// Returns the list of hacks and their details
///
pub fn hacks(deps: Deps) -> StdResult<Vec<HacksResponse>> {
    let hacks = HACKS
        .range(deps.storage, None, None, Order::Ascending)
        .map(|item| {
            let (_, hacks) = item?;
            Ok(HacksResponse {
                date: hacks.date,
                contract_exploited: hacks.contract_exploited,
                total_amount_hacked: hacks.total_amount_hacked,
                bounty: hacks.bounty,
                hacker_addr: hacks.hacker_addr,
            })
        })
        .collect::<StdResult<Vec<HacksResponse>>>()?;

    Ok(hacks)
}
