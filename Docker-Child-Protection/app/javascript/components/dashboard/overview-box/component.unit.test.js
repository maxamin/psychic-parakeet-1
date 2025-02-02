import { fromJS } from "immutable";
import { CircularProgress } from "@material-ui/core";

import { setupMountedComponent } from "../../../test";

import OverviewBox from "./component";

describe("<OverviewBox />", () => {
  let component;
  const props = {
    items: fromJS({
      name: "dashboard.approvals_closure",
      type: "indicator",
      indicators: {
        approval_closure_pending: {
          count: 5,
          query: [
            "owned_by=primero",
            "record_state=true",
            "status=open",
            "approval_status_closure=pending"
          ]
        }
      }
    }),
    sumTitle: "Closure"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(OverviewBox, props, {}));
  });

  it("renders a component/>", () => {
    expect(component.find(OverviewBox)).to.have.lengthOf(1);
    expect(component.find("li")).to.have.lengthOf(1);
    expect(component.find("button")).to.have.lengthOf(1);
    expect(component.find("div div").text()).to.equal("5 Closure");
  });

  describe("when withTotal props is false", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        OverviewBox,
        { ...props, withTotal: false },
        {}
      ));
    });
    it("renders the header without total/>", () => {
      expect(component.find(OverviewBox)).to.have.lengthOf(1);
      expect(component.find("li")).to.have.lengthOf(1);
      expect(component.find("button")).to.have.lengthOf(1);
      expect(component.find("div div").text()).to.equal("Closure");
    });
  });

  describe("When data still loading", () => {
    let loadingComponent;
    const loadingProps = {
      items: fromJS({
        name: "dashboard.approvals_closure",
        type: "indicator",
        indicators: {}
      }),
      sumTitle: "Closure",
      loading: true
    };

    before(() => {
      ({ component: loadingComponent } = setupMountedComponent(
        OverviewBox,
        loadingProps,
        {}
      ));
    });

    it("renders BadgedIndicator component", () => {
      expect(loadingComponent.find(OverviewBox)).to.have.lengthOf(1);
    });
    it("renders CircularProgress", () => {
      expect(loadingComponent.find(CircularProgress)).to.have.lengthOf(1);
    });
  });
});
