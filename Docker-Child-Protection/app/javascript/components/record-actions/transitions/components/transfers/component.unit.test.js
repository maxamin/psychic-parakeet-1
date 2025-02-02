import { Map, List } from "immutable";
import { FormControlLabel, Checkbox, TextField } from "@material-ui/core";
import clone from "lodash/clone";
import { Formik } from "formik";

import { setupMountedComponent } from "../../../../../test";
import { MODULES } from "../../../../../config";
import SearchableSelect from "../../../../searchable-select";

import ProvidedConsent from "./provided-consent";
import TransferForm from "./component";

describe("<TransferForm />", () => {
  let component;
  const record = Map({
    id: "03cdfdfe-a8fc-4147-b703-df976d200977",
    case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
    case_id_display: "9b4c525",
    name_first: "Hello",
    name_last: "World",
    name: "Hello World",
    module_id: MODULES.CP,
    consent_for_services: true
  });
  const defaultState = Map({
    application: Map({
      agencies: List([Map({ unique_id: "agency-unicef", name: "UNICEF" })])
    }),
    transitions: Map({
      transfer: Map({
        users: [{ id: 13, user_name: "primero_cp_ar" }]
      }),
      reassign: Map({
        users: [{ id: 13, user_name: "primero_cp_ar" }]
      })
    })
  });
  const props = {
    providedConsent: true,
    isBulkTransfer: false,
    userPermissions: Map({ cases: ["manage"] }),
    handleClose: () => {},
    transitionType: "transfer",
    record,
    recordType: "cases"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(TransferForm, props, defaultState));
  });

  it("renders FormControlLabel", () => {
    expect(component.find(FormControlLabel)).to.have.length(2);
  });

  it("renders Checkbox", () => {
    expect(component.find(Checkbox)).to.have.length(2);
  });

  it("renders TextField", () => {
    expect(component.find(TextField)).to.have.length(4);
  });

  it("renders SearchableSelect", () => {
    expect(component.find(SearchableSelect)).to.have.length(3);
  });

  it("should accept valid props", () => {
    const componentProps = clone(component.find(TransferForm).first().props());

    expect(componentProps).to.have.property("providedConsent");
    expect(componentProps).to.have.property("isBulkTransfer");
    expect(componentProps).to.have.property("userPermissions");
    expect(componentProps).to.have.property("handleClose");
    expect(componentProps).to.have.property("transitionType");
    expect(componentProps).to.have.property("record");
    expect(componentProps).to.have.property("recordType");
    delete componentProps.providedConsent;
    delete componentProps.isBulkTransfer;
    delete componentProps.userPermissions;
    delete componentProps.handleClose;
    delete componentProps.transitionType;
    delete componentProps.record;
    delete componentProps.recordType;

    expect(componentProps).to.deep.equal({});
  });

  it("renders ProvidedConsent with valid props", () => {
    const providedConsentProps = { ...component.find(ProvidedConsent).props() };

    [
      "canConsentOverride",
      "providedConsent",
      "setDisabled",
      "recordType"
    ].forEach(property => {
      expect(providedConsentProps).to.have.property(property);
      delete providedConsentProps[property];
    });
    expect(providedConsentProps).to.be.empty;
  });

  it("renders Formik with valid props", () => {
    const formikProps = { ...component.find(Formik).props() };

    expect(component.find(Formik)).to.have.lengthOf(1);
    [
      "enableReinitialize",
      "isInitialValid",
      "initialValues",
      "onSubmit",
      "render",
      "validationSchema",
      "validateOnBlur",
      "validateOnChange"
    ].forEach(property => {
      expect(formikProps).to.have.property(property);
      delete formikProps[property];
    });
    expect(formikProps).to.be.empty;
  });
});
