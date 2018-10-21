import { storiesOf } from "@storybook/react";
import * as React from "react";
import { InvestmentSuccessComponent } from "./Success";

storiesOf("Investment/Success", module).add("default", () => (
  <InvestmentSuccessComponent goToPortfolio={() => {}} txHash="tx-hash" />
));
