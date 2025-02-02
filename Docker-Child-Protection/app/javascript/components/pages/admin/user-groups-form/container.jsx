import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";

import { useI18n } from "../../../i18n";
import Form, { FormAction, whichFormMode } from "../../../form";
import { PageHeading, PageContent } from "../../../page";
import LoadingIndicator from "../../../loading-indicator";
import NAMESPACE from "../user-groups-list/namespace";
import { ROUTES, SAVE_METHODS } from "../../../../config";
import { usePermissions } from "../../../user";
import { WRITE_RECORDS } from "../../../../libs/permissions";
import bindFormSubmit from "../../../../libs/submit-form";

import { form, validations } from "./form";
import {
  fetchUserGroup,
  clearSelectedUserGroup,
  saveUserGroup
} from "./action-creators";
import { getUserGroup, getServerErrors, getSavingRecord } from "./selectors";
import { NAME } from "./constants";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const userGroup = useSelector(state => getUserGroup(state));
  const formErrors = useSelector(state => getServerErrors(state));
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");
  const saving = useSelector(state => getSavingRecord(state));
  const validationSchema = validations(formMode, i18n);

  const cantEditUserGroup = usePermissions(NAMESPACE, WRITE_RECORDS);

  const handleSubmit = data => {
    dispatch(
      saveUserGroup({
        id,
        saveMethod: formMode.get("isEdit")
          ? SAVE_METHODS.update
          : SAVE_METHODS.new,
        body: { data },
        message: i18n.t(
          `user_group.messages.${
            formMode.get("isEdit") ? "updated" : "created"
          }`
        )
      })
    );
  };

  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };

  const handleCancel = () => {
    dispatch(push(ROUTES.admin_user_groups));
  };

  useEffect(() => {
    if (isEditOrShow) {
      dispatch(fetchUserGroup(id));
    }

    return () => {
      if (isEditOrShow) {
        dispatch(clearSelectedUserGroup());
      }
    };
  }, [id]);

  const saveButton =
    formMode.get("isEdit") || formMode.get("isNew") ? (
      <>
        <FormAction
          cancel
          actionHandler={handleCancel}
          text={i18n.t("buttons.cancel")}
        />
        <FormAction
          actionHandler={() => bindFormSubmit(formRef)}
          text={i18n.t("buttons.save")}
          savingRecord={saving}
        />
      </>
    ) : null;

  const editButton = formMode.get("isShow") ? (
    <FormAction actionHandler={handleEdit} text={i18n.t("buttons.edit")} />
  ) : null;

  const pageHeading = userGroup?.size
    ? `${i18n.t("user_groups.label")} ${userGroup.get("name")}`
    : i18n.t("user_groups.label");

  return (
    <LoadingIndicator
      hasData={formMode.get("isNew") || userGroup?.size > 0}
      type={NAMESPACE}
    >
      <PageHeading title={pageHeading}>
        {cantEditUserGroup && editButton}
        {saveButton}
      </PageHeading>
      <PageContent>
        <Form
          useCancelPrompt
          mode={mode}
          formSections={form(i18n, formMode)}
          onSubmit={handleSubmit}
          ref={formRef}
          validations={validationSchema}
          initialValues={userGroup.toJS()}
          formErrors={formErrors}
        />
      </PageContent>
    </LoadingIndicator>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Container;
