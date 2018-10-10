import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Counter } from "./Counter";

const day = 86400000;

const futureDate = new Date(Date.now() + 7 * day);

storiesOf("Counter", module).add("default", () => <Counter endDate={futureDate} />);
