import { storiesOf } from "@storybook/react";
import * as React from "react";

import { TEtoSpecsData } from "../../../../lib/api/eto/EtoApi.interfaces";
import { ModalComponentBody } from "../../ModalComponentBody";
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
  accountName: "Fifth Force GmbH",
  country: "DE",
  recipient: "Fifth Force GmbH",
  iban: "DE1250094039446384529400565",
  bic: "TLXXXXXXXXX",
  referenceCode: "NF AGHGCmR3u2SuxdyNPIksxTyAhKM REF 123456789011 G WL",
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
  .addDecorator(story => (
    <div style={{ maxWidth: "37.5rem" }}>
      <ModalComponentBody onClose={() => {}}>{story()}</ModalComponentBody>
    </div>
  ))
  .add("Details", () => <BankTransferDetailsComponent {...detailsData} />)
  .add("Summary", () => <BankTransferSummaryComponent {...summaryData} />);
