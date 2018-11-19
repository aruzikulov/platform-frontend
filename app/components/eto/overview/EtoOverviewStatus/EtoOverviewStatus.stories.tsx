import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { EtoOverviewStatusLayout } from ".";
import {
  EETOStateOnChain,
  TEtoWithCompanyAndContract,
} from "../../../../modules/public-etos/types";
import { withStore } from "../../../../utils/storeDecorator";
import { EtoWidgetContext } from "../../EtoWidgetView";

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
} as TEtoWithCompanyAndContract;

storiesOf("ETO/EtoOverviewStatus", module)
  .addDecorator(
    withStore({
      publicEtos: {
        publicEtos: { [eto.previewCode]: eto },
        companies: { [eto.companyId]: eto.company },
        contracts: { [eto.previewCode]: eto.contract },
      },
    }),
  )
  .add("default", () => (
    <EtoWidgetContext.Provider value={eto.previewCode}>
      <EtoOverviewStatusLayout eto={eto} isAuthorized={true} isEligibleToPreEto={true} />
    </EtoWidgetContext.Provider>
  ))
  .add("with whitelist discount", () => (
    <EtoWidgetContext.Provider value={eto.previewCode}>
      <EtoOverviewStatusLayout
        eto={eto}
        isAuthorized={true}
        isEligibleToPreEto={true}
        isPreEto={true}
      />
    </EtoWidgetContext.Provider>
  ))
  .add("without discount", () => (
    <EtoWidgetContext.Provider value={eto.previewCode}>
      <EtoOverviewStatusLayout
        eto={{ ...eto, publicDiscountFraction: 0 }}
        isAuthorized={true}
        isEligibleToPreEto={true}
      />
    </EtoWidgetContext.Provider>
  ));
