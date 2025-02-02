import sinon from "sinon";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("Application - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    [
      "fetchSystemPermissions",
      "fetchSystemSettings",
      "loadApplicationResources",
      "setNetworkStatus",
      "setUserIdle"
    ].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check the 'fetchSystemSettings' action creator to return the correct object", () => {
    const expected = {
      path: "system_settings",
      params: { extended: true },
      db: {
        collection: "system_settings"
      }
    };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch(actionCreators.fetchSystemSettings());

    expect(dispatch.getCall(0).returnValue.type).to.eql(
      "application/FETCH_SYSTEM_SETTINGS"
    );

    expect(dispatch.getCall(0).returnValue.api).to.eql(expected);
  });

  it("should create an action to set the user to idle", () => {
    const expectedAction = {
      type: "application/SET_USER_IDLE",
      payload: true
    };

    expect(actionCreators.setUserIdle(true)).to.eql(expectedAction);
  });

  it("should create an action to set the network status", () => {
    const expectedAction = {
      type: "application/NETWORK_STATUS",
      payload: true
    };

    expect(actionCreators.setNetworkStatus(true)).to.eql(expectedAction);
  });

  it("should check the 'fetchSystemPermissions' action creator to return the correct object", () => {
    const expected = {
      type: actions.FETCH_SYSTEM_PERMISSIONS,
      api: {
        path: "permissions"
      }
    };

    expect(actionCreators.fetchSystemPermissions()).to.deep.equal(expected);
  });
});
