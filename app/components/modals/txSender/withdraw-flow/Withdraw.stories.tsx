import { storiesOf } from "@storybook/react";
import * as React from "react";

import { IGasState } from "../../../../modules/gas/reducer";
import { WithdrawComponent } from "./Withdraw";

export const dummyEthereumAddress = "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359";

const gas: IGasState = {
  loading: false,
  gasPrice: {
    fast: "0",
    fastest: "0",
    safeLow: "0",
    standard: "23000000000",
  },
};

storiesOf("Withdraw", module)
  .add("default", () => (
    <WithdrawComponent onAccept={() => {}} />
  ));
