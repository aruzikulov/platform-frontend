import { storiesOf } from "@storybook/react";
import * as React from "react";

import { InvestmentSummaryComponent } from "./Summary";

const data = {
  companyName: "X company",
  etoAddress: "0x123434562134asdf2412341234adf12341234",
  investmentEth: "12345678900000000000",
  investmentEur: "123456789000000000000000",
  gasCostEth: "2000000000000000",
  equityTokens: "500",
  estimatedReward: "40000000000000000000",
  etherPriceEur: "200",
};

storiesOf("Investment/InvestmentSummary", module).add("default", () => (
  <InvestmentSummaryComponent {...data} onAccept={() => {}} downloadAgreement={() => {}} />
));
