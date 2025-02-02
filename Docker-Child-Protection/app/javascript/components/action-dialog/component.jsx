import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  CircularProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { useI18n } from "../i18n";

import TitleWithClose from "./text-with-close";
import styles from "./styles.css";

const ActionDialog = ({
  open,
  successHandler,
  cancelHandler,
  dialogTitle,
  dialogSubtitle,
  dialogText,
  confirmButtonLabel,
  children,
  onClose,
  confirmButtonProps,
  omitCloseAfterSuccess,
  maxSize,
  pending,
  enabledSuccessButton
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const handleClose = event => {
    event.stopPropagation();
    if (cancelHandler) {
      cancelHandler();
    } else {
      onClose();
    }
  };

  const handleSuccess = event => {
    event.stopPropagation();
    successHandler();
    if (!omitCloseAfterSuccess) handleClose(event);
  };

  const stopPropagation = event => event.stopPropagation();

  const defaultSuccessButtonProps = {
    color: "primary",
    autoFocus: true
  };

  const successButtonProps =
    confirmButtonProps && Object.keys(confirmButtonProps)
      ? confirmButtonProps
      : defaultSuccessButtonProps;

  const dialogHeader = onClose ? (
    <TitleWithClose
      dialogTitle={dialogTitle}
      dialogSubtitle={dialogSubtitle}
      closeHandler={handleClose}
    />
  ) : (
    <DialogTitle>{dialogTitle}</DialogTitle>
  );

  const submitButton = (
    <div className={css.submitButtonWrapper}>
      <Button
        {...{ ...successButtonProps, onClick: handleSuccess }}
        disabled={pending || !enabledSuccessButton}
      >
        {confirmButtonLabel}
      </Button>
      {pending && <CircularProgress size={24} className={css.buttonProgress} />}
    </div>
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
    <div onClick={stopPropagation}>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={maxSize || "sm"}
        aria-labelledby="action-dialog-title"
        aria-describedby="action-dialog-description"
      >
        {dialogHeader}
        <DialogContent>
          {dialogText ? (
            <DialogContentText>{dialogText}</DialogContentText>
          ) : (
            children
          )}
        </DialogContent>
        <DialogActions>
          {submitButton}
          {cancelHandler ? (
            <Button onClick={cancelHandler} color="primary">
              {i18n.t("cancel")}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </div>
  );
};

ActionDialog.displayName = "ActionDialog";

ActionDialog.defaultProps = {
  enabledSuccessButton: true
};

ActionDialog.propTypes = {
  cancelHandler: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  confirmButtonLabel: PropTypes.string,
  confirmButtonProps: PropTypes.object,
  dialogSubtitle: PropTypes.string,
  dialogText: PropTypes.string,
  dialogTitle: PropTypes.string,
  enabledSuccessButton: PropTypes.bool,
  maxSize: PropTypes.string,
  omitCloseAfterSuccess: PropTypes.bool,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  successHandler: PropTypes.func
};

export default ActionDialog;
