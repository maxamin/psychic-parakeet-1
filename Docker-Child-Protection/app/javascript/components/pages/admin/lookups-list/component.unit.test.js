import { fromJS } from "immutable";
import MUIDataTable from "mui-datatables";

import { setupMountedComponent } from "../../../../test";
import { PageHeading } from "../../../page";
import { ACTIONS } from "../../../../libs/permissions";

import LookupList from "./component";

describe("<LookupList />", () => {
  let component;
  const state = fromJS({
    user: {
      permissions: {
        metadata: [ACTIONS.MANAGE]
      }
    },
    forms: {
      options: {
        lookups: {
          data: [
            {
              id: 1,
              unique_id: "lookup-test",
              name: { en: "Test" },
              values: [
                { id: "a", display_text: [{ en: "Service a" }] },
                { id: "b", display_text: [{ en: "Service b" }] }
              ]
            }
          ]
        }
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(LookupList, {}, state));
  });

  it("renders a PageHeading component", () => {
    expect(component.find(PageHeading)).to.have.lengthOf(1);
  });

  it("renders a MUIDataTable component", () => {
    expect(component.find(MUIDataTable)).to.have.lengthOf(1);
  });
});
