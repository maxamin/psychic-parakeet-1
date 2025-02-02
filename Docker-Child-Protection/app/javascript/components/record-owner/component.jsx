import React from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";

import { FieldRecord, FormSectionField } from "../record-form";
import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";

import { NAME, FIELDS } from "./constants";

const Component = ({ record, recordType, mobileDisplay, handleToggleNav }) => {
  const i18n = useI18n();

  const recordOwnerValues = FIELDS.map(a => a.name).reduce((acum, field) => {
    return { ...acum, [field]: record?.get(field) };
  }, {});

  const renderFields = FIELDS.map(f => {
    const field = { ...f };

    field.display_name = { en: i18n.t(`record_information.${field.name}`) };

    const formattedField = FieldRecord(field);
    const fieldProps = {
      name: formattedField.name,
      field: formattedField,
      mode: {
        isShow: true,
        isEdit: false
      },
      recordType,
      recordID: record?.get("id")
    };

    return (
      <FormSectionField
        key={`${formattedField.name}-record-owner-form`}
        {...fieldProps}
      />
    );
  });

  return (
    <div key="record-owner-div">
      <RecordFormTitle
        mobileDisplay={mobileDisplay}
        handleToggleNav={handleToggleNav}
        displayText={i18n.t("forms.record_types.record_information")}
      />
      <Formik key="record-owner-formik" initialValues={recordOwnerValues}>
        <Form>{renderFields}</Form>
      </Formik>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  record: PropTypes.object,
  recordType: PropTypes.string
};
export default Component;
