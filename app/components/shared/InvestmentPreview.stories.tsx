import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ModalComponentBody } from "../modals/ModalComponentBody";
import { InvestmentPreview } from "./InvestmentPreview";

const defaultProps = {
  neuInvestorsNum: 100,
  company: "Company",
  endInDays: 1,
  tags: [{ text: "tag1" }],
  detailsLink: "No details",
  preFoundingStatus: {
    money: "1.000.000",
    investorsNum: 100,
    leadInvestors: ["Jackie chan", "Jet li"],
  },
  hasStarted: false,
  startingOn: "19/10/2020",
  moneyGoal: "5.000.000",
  currentValuation: "10.000.000",
  tokenPrice: "0.50",
  linkToDetails: "http://localhost:9001",
  handleEmailSend: () => {},
};

storiesOf("InvestmentPreview", module)
  .addDecorator(story => (
    <div style={{ maxWidth: "37.5rem" }}>
      <ModalComponentBody onClose={() => {}}>{story()}</ModalComponentBody>
    </div>
  ))
  .add("ETO didn't start", () => <InvestmentPreview {...defaultProps} />)
  .add("ETO ends in 1 day", () => <InvestmentPreview {...defaultProps} hasStarted={true} />)
  .add("ETO ends in more day", () => (
    <InvestmentPreview {...defaultProps} hasStarted={true} endInDays={20} />
  ));
