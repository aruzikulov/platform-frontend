import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { MyWalletWidgetComponentBody } from "./MyWalletWidget";

import { tid } from "../../../../test/testUtils";

describe("<MyWalletWidget />", () => {
  let initialEnvVar: any;

  it("should render all default components when icbm and locket wallets are connected", () => {
    process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED = "1";

    const props = {
      isLoading: false,
      data: {
        euroTokenEuroAmount: "66482" + "0".repeat(14),
        euroTokenAmount: "36490" + "0".repeat(18),
        ethAmount: "66482" + "0".repeat(14),
        ethEuroAmount: "6004904646" + "0".repeat(16),
        percentage: "-3.67",
        totalAmount: "637238" + "0".repeat(18),
        isIcbmWalletConnected: true,
        isLockedWalletConnected: true,
      },
    };

    const component = shallow(<MyWalletWidgetComponentBody {...props} />);

    expect(component.find(tid("my-wallet-widget-eur-token"))).to.have.length(1);
    expect(component.find(tid("my-wallet-widget-eth-token"))).to.have.length(1);
    expect(component.find(tid("my-wallet-widget-total"))).to.have.length(1);
    expect(component.find(tid("my-wallet-widget-icbm-help-text"))).to.have.length(0);
  });

  it("should render icbm help text when icbm and locked wallets are disconnected connected", () => {
    process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED = "1";

    const props = {
      isLoading: false,
      data: {
        euroTokenEuroAmount: "66482" + "0".repeat(14),
        euroTokenAmount: "36490" + "0".repeat(18),
        ethAmount: "66482" + "0".repeat(14),
        ethEuroAmount: "6004904646" + "0".repeat(16),
        percentage: "-3.67",
        totalAmount: "637238" + "0".repeat(18),
        isIcbmWalletConnected: false,
        isLockedWalletConnected: false,
      },
    };

    const component = shallow(<MyWalletWidgetComponentBody {...props} />);

    expect(component.find(tid("my-wallet-widget-icbm-help-text"))).to.have.length(1);
  });

  beforeEach(() => {
    initialEnvVar = process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED;
  });

  afterEach(() => {
    process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED = initialEnvVar;
  });
});
