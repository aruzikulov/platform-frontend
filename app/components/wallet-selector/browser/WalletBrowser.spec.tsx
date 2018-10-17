import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { tid } from "../../../../test/testUtils";
import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { WalletBrowserComponent } from "./WalletBrowser";

describe("<WalletBrowser />", () => {
  it("should render loading indicator", () => {
    const component = shallow(
      <WalletBrowserComponent isLoading={true} isLoginRoute intl={dummyIntl} />,
    );
    expect(component.contains(<LoadingIndicator />)).to.be.true;
  });

  it("should render error message", () => {
    const errorMsg = "some error";
    const component = shallow(
      <WalletBrowserComponent
        isLoading={false}
        errorMessage={errorMsg}
        isLoginRoute
        intl={dummyIntl}
      />,
    );
    expect(component.find(tid("browser-wallet-error-msg")).text()).to.be.eq(errorMsg);
  });
});
