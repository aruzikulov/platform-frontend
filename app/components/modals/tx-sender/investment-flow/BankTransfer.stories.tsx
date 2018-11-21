import { storiesOf } from "@storybook/react";
import * as React from "react";

import { TEtoSpecsData } from "../../../../lib/api/eto/EtoApi.interfaces";
import { BankTransferDetailsComponent } from "./BankTransferDetails";
import { BankTransferSummaryComponent } from "./BankTransferSummary";

// tslint:disable-next-line:no-object-literal-type-assertion
const eto = {
  etoId: "0xfufu",
  preMoneyValuationEur: 10000,
  existingCompanyShares: 10,
  equityTokensPerShare: 10,
} as TEtoSpecsData;

const detailsData = {
  accountName: "fufu name",
  country: "lala land",
  recipient: "kuku company",
  iban: "foo iban asdf",
  bic: "bar bic",
  referenceCode: "asdfölk",
  amount: "123456781234567812345678",
  onGasStipendChange: () => {},
  handleCheckbox: () => {},
};

const summaryData = {
  eto,
  companyName: "fufu company",
  investmentEur: "10000000000000000000000",
  equityTokens: "1234",
  estimatedReward: "3456123412341231234123412344",
  onAccept: () => {},
  downloadAgreement: () => {},
};

storiesOf("Investment/Bank Transfer", module)
  .add("Details", () => <BankTransferDetailsComponent {...detailsData} />)
  .add("Summary", () => <BankTransferSummaryComponent {...summaryData} />);
