import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { EETOStateOnChain, TEtoWithCompanyAndContract } from "../../../modules/public-etos/types";
import { EtoInvestmentTermsWidgetLayout } from "./EtoInvestmentTermsWidget";

// tslint:disable-next-line:no-object-literal-type-assertion
const eto = {
  etoId: "0x123434562134asdf2412341234adf12341234",
  companyId: "asdf",
  previewCode: "1234",
  preMoneyValuationEur: 10000,
  existingCompanyShares: 10,
  equityTokensPerShare: 10,
  publicDiscountFraction: 0.2,
  whitelistDiscountFraction: 0.3,
  company: {},
  contract: {
    timedState: EETOStateOnChain.Whitelist,
    totalInvestment: { totalInvestors: new BigNumber("123"), totalTokensInt: new BigNumber("234") },
  },
  templates: {},
} as TEtoWithCompanyAndContract;

storiesOf("ETO/EtoInvestmentTermsWidget", module).add("default", () => (
  <EtoInvestmentTermsWidgetLayout etoData={eto} downloadDocument={() => {}} />
));
