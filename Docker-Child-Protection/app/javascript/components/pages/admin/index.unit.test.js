import * as index from "./index";

describe("pages/admin - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    [
      "default",
      "AgenciesForm",
      "AgenciesList",
      "AuditLogs",
      "ContactInformation",
      "FormBuilder",
      "FormsList",
      "LookupsList",
      "RolesForm",
      "RolesList",
      "UserGroupsForm",
      "UserGroupsList",
      "UsersForm",
      "UsersList"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
