#[cfg(test)]
mod tests {
    use crate::{
        contract::{execute, instantiate, query},
        msg::{ExecuteMsg, InstantiateMsg, QueryMsg, SubscriptionResponse},
    };
    use cosmwasm_std::{
        attr, coin, from_binary,
        testing::{mock_dependencies, mock_env, mock_info},
        Uint128,
    };

    pub const OWNER: &str = "owner";
    pub const USER: &str = "user";
    pub const DENOM: &str = "denom";
    pub const INSTANTIATE_CW721_REPLY_ID: u64 = 0;

    #[test]
    fn test_instantiate() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info(OWNER, &[coin(100, DENOM)]);
        let msg = InstantiateMsg {
            protocol_fee: Uint128::zero(),
            cw721_code_id: INSTANTIATE_CW721_REPLY_ID,
            cw721_name: "NAME".to_string(),
            cw721_symbol: "SYMBOL".to_string(),
            cw721_label: "label".to_string(),
            cw721_admin: Some("contract_address".to_string()),
        };
        let res = instantiate(deps.as_mut(), env, info, msg).unwrap();
        assert_eq!(res.attributes.len(), 3);
        assert_eq!(
            res.attributes,
            vec![
                attr("action", "instantiate"),
                attr("contract_owner", OWNER),
                attr("protocol_fee", 0.to_string())
            ]
        );
    }

    #[test]
    fn test_boilerplate() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info(OWNER, &[coin(1_000_000, DENOM)]);
        let msg = InstantiateMsg {
            protocol_fee: Uint128::zero(),
            cw721_code_id: INSTANTIATE_CW721_REPLY_ID,
            cw721_name: "NAME".to_string(),
            cw721_symbol: "SYMBOL".to_string(),
            cw721_label: "label".to_string(),
            cw721_admin: Some("contract_address".to_string()),
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();

        let execute_msg = ExecuteMsg::Subscribe {
            subscriber: USER.to_string(),
            bounty_pct: Uint128::from(20u128),
            min_bounty: None,
        };

        let execute_info = mock_info(USER, &[coin(1_000, DENOM)]);

        let res = execute(
            deps.as_mut(),
            env.clone(),
            execute_info,
            execute_msg.clone(),
        );

        assert_eq!(
            res.unwrap().attributes,
            vec![
                attr("action", "subscribe"),
                attr("subscriber", USER),
                attr("bounty_pct", 20.to_string()),
                attr("min_bounty", "0"),
            ]
        );

        // query highest bidder should return new bidder addr2 & 9990000 (10_000_000 - 10_000)
        let query_msg = QueryMsg::Subscription {
            protected_addr: USER.to_string(),
        };
        let _res: SubscriptionResponse =
            from_binary(&query(deps.as_ref(), env.clone(), query_msg).unwrap()).unwrap();
    }
}
