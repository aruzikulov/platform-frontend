import { storiesOf } from "@storybook/react";
import * as React from "react";

import { TEtoSpecsData } from "../../../../lib/api/eto/EtoApi.interfaces";
import { ModalComponentBody } from "../../ModalComponentBody";
import { InvestmentSummaryComponent } from "./Summary";

// tslint:disable-next-line:no-object-literal-type-assertion
const eto = {
  etoId: "0x123434562134asdf2412341234adf12341234",
} as TEtoSpecsData;

const etoWithDiscount = {
  ...eto,
  preMoneyValuationEur: 10000,
  existingCompanyShares: 10,
  equityTokensPerShare: 10,
};

const data = {
  eto,
  companyName: "X company",
  investmentEth: "12345678900000000000",
  investmentEur: "12345678900000000000000",
  gasCostEth: "2000000000000000",
  equityTokens: "500",
  estimatedReward: "40000000000000000000",
  etherPriceEur: "200",
  onAccept: () => {},
  downloadAgreement: () => {},
};

const dataWithPriceDiscount = {
  ...data,
  eto: etoWithDiscount,
};

storiesOf("Investment/InvestmentSummary", module)
  .addDecorator(story => (
    <div style={{ maxWidth: "37.5rem" }}>
      <ModalComponentBody onClose={() => {}}>{story()}</ModalComponentBody>
    </div>
  ))
  .add("default", () => <InvestmentSummaryComponent {...data} />)
  .add("with token price discount", () => <InvestmentSummaryComponent {...dataWithPriceDiscount} />)
  .add("isIcbm", () => <InvestmentSummaryComponent {...data} isIcbm={true} estimatedReward="0" />);
