import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withStore } from "../../utils/storeDecorator";
import { PortfolioLayout, TPortfolioLayoutProps } from "./PortfolioLayout";

const data: TPortfolioLayoutProps = {
  myAssets: [],
  pendingAssets: [],
  myNeuBalance: "1234",
  myNeuBalanceEuroAmount: "2345",
  neuPrice: "3456",
  walletAddress: "0x12345678",
  isRetailEto: false,
};

storiesOf("Portfolio/PortfolioLayout", module)
  .addDecorator(withStore({}))
  .add("default", () => <PortfolioLayout {...data} />);
