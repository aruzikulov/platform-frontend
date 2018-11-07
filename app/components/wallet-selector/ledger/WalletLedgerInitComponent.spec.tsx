import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { tid } from "../../../../test/testUtils";
import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import { WalletLedgerInitComponent } from "./WalletLedgerInitComponent";

describe("<WalletLedgerInitComponent />", () => {
  it("should render error message", () => {
    const errorMsg = "some error";
    const component = shallow(
      <WalletLedgerInitComponent
        errorMessage={errorMsg}
        isInitialConnectionInProgress={false}
        intl={dummyIntl}
      />,
    );
    expect(component.find(tid("ledger-wallet-error-msg")).text()).to.be.eq(errorMsg);
  });
});
