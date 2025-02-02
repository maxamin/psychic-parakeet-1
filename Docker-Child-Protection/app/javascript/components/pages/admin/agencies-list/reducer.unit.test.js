import { fromJS } from "immutable";

import actions from "./actions";
import reducer from "./reducer";

describe("<AgenciesList /> - Reducers", () => {
  it("should handle AGENCIES_STARTED", () => {
    const expected = fromJS({
      loading: true,
      errors: false
    });

    const action = {
      type: actions.AGENCIES_STARTED,
      payload: true
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle AGENCIES_SUCCESS", () => {
    const expected = fromJS({
      data: [{ id: 3 }],
      metadata: { per: 20 }
    });

    const action = {
      type: actions.AGENCIES_SUCCESS,
      payload: { data: [{ id: 3 }], metadata: { per: 20 } }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle AGENCIES_FAILURE", () => {
    const expected = fromJS({
      loading: false,
      errors: true
    });

    const action = {
      type: actions.AGENCIES_FAILURE
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle AGENCIES_FINISHED", () => {
    const expected = fromJS({
      loading: false,
      errors: false
    });

    const action = {
      type: actions.AGENCIES_FINISHED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
