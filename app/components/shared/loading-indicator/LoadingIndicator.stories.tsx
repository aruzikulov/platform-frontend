import { storiesOf } from "@storybook/react";
import * as React from "react";

import { LoadingIndicator } from "./LoadingIndicator";

storiesOf("LoadingIndicator", module)
  .add("pulse (default)", () => <LoadingIndicator />)
  .add("blocks", () => <LoadingIndicator type="blocks" />)
  .add("hexagon", () => <LoadingIndicator type="hexagon" />);
