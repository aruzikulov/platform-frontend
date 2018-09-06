import { storiesOf } from "@storybook/react";
import * as React from "react";

import { InvestmentSummaryComponent } from "./Summary";

const data = {
  companyName: "X company",
  tokenPrice: 0.34,
  etoAddress: "0x123434562134asdf2412341234adf12341234",
  investmentEth: "12345678900000000000",
  investmentEur: "123456789000000000000000",
  gasCostEth: "2000000000000000",
  equityTokens: "500.12345 Tokens",
  estimatedReward: "40000000000000000000",
  etherPriceEur: "200",
  agreementUrl: "somePDF.pdf",
};

storiesOf("InvestmentSummary", module).add("default", () => (
  <InvestmentSummaryComponent {...data} onAccept={() => {}} />
));
