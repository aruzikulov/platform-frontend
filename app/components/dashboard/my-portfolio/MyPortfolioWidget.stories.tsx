import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Q18 } from "../../../config/constants";
import { MyPortfolioWidgetComponent } from "./MyPortfolioWidget";

storiesOf("MyPortfolioWidget", module)
  .add("loading", () => <MyPortfolioWidgetComponent isLoading />)
  .add("loaded", () => (
    <MyPortfolioWidgetComponent
      isLoading={false}
      {...{
        balanceEur: "12312352413",
        balanceNeu: Q18.mul(123).toString(),
        isIcbmWalletConnected: true,
      }}
    />
  ))
  .add("loaded, no funds", () => (
    <MyPortfolioWidgetComponent
      isLoading={false}
      {...{ balanceEur: "0", balanceNeu: "0", isIcbmWalletConnected: true }}
    />
  ));
