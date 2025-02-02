import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_LOOKUPS_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case actions.FETCH_LOOKUPS_SUCCESS:
      return state
        .set("data", fromJS(payload.data))
        .set("metadata", fromJS(payload.metadata));
    case actions.FETCH_LOOKUPS_FAILURE:
      return state.set("errors", true).set("loading", false);
    case actions.FETCH_LOOKUPS_FINISHED:
      return state.set("errors", false).set("loading", false);
    default:
      return state;
  }
};
