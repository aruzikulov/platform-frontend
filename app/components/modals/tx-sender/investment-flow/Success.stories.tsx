import { storiesOf } from "@storybook/react";
import * as React from "react";
import { ModalComponentBody } from "../../ModalComponentBody";
import { InvestmentSuccessComponent } from "./Success";

storiesOf("Investment/Success", module)
  .addDecorator(story => (
    <div style={{ maxWidth: "37.5rem" }}>
      <ModalComponentBody onClose={() => {}}>{story()}</ModalComponentBody>
    </div>
  ))
  .add("default", () => <InvestmentSuccessComponent goToPortfolio={() => {}} txHash="tx-hash" />);
