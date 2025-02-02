import { push } from "connected-react-router";
import get from "lodash/get";

import { LOGIN_SUCCESS_CALLBACK } from "../components/pages/login/login-form";
import { signOut } from "../components/pages/login/idp-selection";
import {
  Actions,
  attemptSignout,
  setAuthenticatedUser
} from "../components/user";
import DB from "../db";
import { ROUTES } from "../config";

import { startSignout } from "./utils";

function redirectTo(store, path) {
  store.dispatch(push(path));
}

function logoutSuccessHandler(store) {
  localStorage.removeItem("user");
  redirectTo(store, "/login");
}

async function loginSuccessHandler(store, user) {
  const { user_name: username, id } = user;

  const userFromDB = await DB.getRecord("user", username);

  if (!userFromDB) {
    await DB.clearDB();
  }

  localStorage.setItem("user", JSON.stringify({ username, id }));
  store.dispatch(setAuthenticatedUser({ username, id }));
  redirectTo(store, ROUTES.dashboard);
}

const authMiddleware = store => next => action => {
  const routeChanged = action.type === "@@router/LOCATION_CHANGE";

  const location =
    routeChanged && get(action, "payload.location.pathname", false);

  const isAuthenticated = store
    .getState()
    .getIn(["user", "isAuthenticated"], false);

  if (routeChanged && location === "/logout") {
    startSignout(store, attemptSignout, signOut);
  }

  if (["/login", "/"].includes(location) && isAuthenticated) {
    redirectTo(store, ROUTES.dashboard);
  }

  if (action.type === LOGIN_SUCCESS_CALLBACK) {
    loginSuccessHandler(store, action.payload.json);
  }

  if ([Actions.LOGOUT_FINISHED, Actions.LOGOUT_FAILURE].includes(action.type)) {
    logoutSuccessHandler(store);
  }

  const searchPattern = /^\/login/;

  if (routeChanged && !searchPattern.test(location) && !isAuthenticated) {
    redirectTo(store, "/login");
  }

  next(action);
};

export default authMiddleware;
