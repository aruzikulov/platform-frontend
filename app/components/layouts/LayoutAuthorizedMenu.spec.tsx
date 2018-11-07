import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { tid } from "../../../test/testUtils";
import { EUserType } from "../../lib/api/users/interfaces";
import { LayoutAuthorizedMenuComponent } from "./LayoutAuthorizedMenu";

describe("<LayoutAuthorizedMenuComponent />", () => {
  const defaultProps = {
    shouldEtoDataLoad: true,
    isIdentityModalOpened: false,
    openIdentityModal: () => {},
    isLinkActive: () => true,
    isIdentityButtonActive: () => true,
    isVerifiedInvestor: false,
    actionRequiredSettings: false,
  };

  it("should render investor menu", () => {
    const MyNeuWidgetComponent = shallow(
      <LayoutAuthorizedMenuComponent userType={EUserType.INVESTOR} {...defaultProps} />,
    );

    expect(MyNeuWidgetComponent.find(tid("issuer-menu"))).to.have.length(0);
    expect(MyNeuWidgetComponent.find(tid("investor-menu"))).to.have.length(1);
  });

  it("should render issuer menu", () => {
    const MyNeuWidgetComponent = shallow(
      <LayoutAuthorizedMenuComponent userType={EUserType.ISSUER} {...defaultProps} />,
    );

    expect(MyNeuWidgetComponent.find(tid("issuer-menu"))).to.have.length(1);
    expect(MyNeuWidgetComponent.find(tid("investor-menu"))).to.have.length(0);
  });

  it("should throw when userType is not defined", () => {
    expect(() => {
      shallow(<LayoutAuthorizedMenuComponent userType={undefined} {...defaultProps} />);
    }).to.throw();
  });
});
