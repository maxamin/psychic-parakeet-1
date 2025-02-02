import { RECORD_PATH, SAVE_METHODS } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import actions from "./actions";

export const fetchForm = id => {
  return {
    type: actions.FETCH_FORM,
    api: {
      path: `${RECORD_PATH.forms}/${id}`
    }
  };
};

export const saveForm = ({ id, body, saveMethod, message }) => {
  const path =
    saveMethod === SAVE_METHODS.update
      ? `${RECORD_PATH.forms}/${id}`
      : RECORD_PATH.forms;

  return {
    type: actions.SAVE_FORM,
    api: {
      path,
      method: saveMethod === SAVE_METHODS.update ? "PATCH" : "POST",
      body,
      successCallback: {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: generate.messageKey()
          }
        },
        redirectToEdit: true,
        redirect: `/admin/${RECORD_PATH.forms}`
      }
    }
  };
};

export const clearSelectedForm = () => {
  return {
    type: actions.CLEAR_SELECTED_FORM
  };
};
