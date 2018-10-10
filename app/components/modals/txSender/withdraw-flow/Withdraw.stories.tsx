import { storiesOf } from "@storybook/react";
import * as React from "react";

import { WithdrawComponent } from "./Withdraw";

storiesOf("Withdraw", module).add("default", () => (
  <WithdrawComponent onAccept={() => {}} maxEther={"100000000000000000000000000000"} />
));
