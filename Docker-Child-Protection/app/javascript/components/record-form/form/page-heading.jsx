import PropTypes from "prop-types";
import React from "react";

import { RECORD_PATH } from "../../../config";

import { RECORD_FORM_TOOLBAR_PAGE_HEADING_NAME } from "./constants";

const Component = ({
  i18n,
  mode,
  params,
  recordType,
  shortId,
  caseIdDisplay,
  toolbarHeading
}) => {
  let heading = "";

  if (mode.isNew) {
    heading = i18n.t(`${params.recordType}.register_new_${recordType}`);
  } else if (mode.isEdit || mode.isShow) {
    heading = i18n.t(`${params.recordType}.show_${recordType}`, {
      short_id:
        params.recordType === RECORD_PATH.cases
          ? caseIdDisplay
          : shortId || "-------"
    });
  }

  return <h2 className={toolbarHeading}>{heading}</h2>;
};

Component.displayName = RECORD_FORM_TOOLBAR_PAGE_HEADING_NAME;

Component.propTypes = {
  caseIdDisplay: PropTypes.string,
  i18n: PropTypes.shape({
    t: PropTypes.func
  }),
  mode: PropTypes.object,
  params: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired,
  shortId: PropTypes.string,
  toolbarHeading: PropTypes.string
};

export default Component;
