import { storiesOf } from "@storybook/react";
import * as React from "react";
import { WithdrawSuccess } from "./Success";

storiesOf("Animations/Success", module).add("default", () => <WithdrawSuccess txHash="tx-hash" />);
