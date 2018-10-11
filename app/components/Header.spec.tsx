import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";
import { tid } from "../../test/testUtils";
import { EUserType } from "../lib/api/users/interfaces";
import { appRoutes } from "./appRoutes";
import { HeaderComponent } from "./Header";

describe("<HeaderComponent />", () => {
  it("should render login to ETO button when unauthorized and on ETO landing page", () => {
    const mockFunction = spy();
    const component = shallow(
      <HeaderComponent
        isAuthorized={false}
        userType={EUserType.INVESTOR}
        logout={mockFunction}
        location={appRoutes.etoLanding}
      />,
    );

    expect(component.find(tid("Header-login-eto"))).to.have.length(1);
  });

  it("should render login button when unauthorized and not on ETO landing page", () => {
    const mockFunction = spy();
    const component = shallow(
      <HeaderComponent
        isAuthorized={false}
        logout={mockFunction}
        location={appRoutes.root}
        userType={EUserType.INVESTOR}
      />,
    );

    expect(component.find(tid("Header-login"))).to.have.length(1);
  });

  it("should not render logout button when unauthorized", () => {
    const mockFunction = spy();
    const component = shallow(
      <HeaderComponent
        isAuthorized={false}
        logout={mockFunction}
        location={""}
        userType={EUserType.INVESTOR}
      />,
    );

    expect(component.find(tid("Header-logout"))).to.have.length(0);
  });

  it("should render logout button when authorized", () => {
    const mockFunction = spy();
    const component = shallow(
      <HeaderComponent
        isAuthorized={true}
        logout={mockFunction}
        location={""}
        userType={EUserType.INVESTOR}
      />,
    );

    expect(component.find(tid("Header-logout"))).to.have.length(1);
  });

  it("should simulate a click and logout", () => {
    const mockFunction = spy();
    const component = shallow(
      <HeaderComponent
        isAuthorized={true}
        logout={mockFunction}
        location={""}
        userType={EUserType.INVESTOR}
      />,
    );
    const LogoutButton = component.find(tid("Header-logout"));

    LogoutButton.simulate("click");

    expect(mockFunction.called).to.be.true;
  });
});
