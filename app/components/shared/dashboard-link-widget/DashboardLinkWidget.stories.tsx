import { storiesOf } from "@storybook/react";
import * as React from "react";

import { DashboardLinkWidget } from "./DashboardLinkWidget";

storiesOf("DashboardLinkWidget", module).add("default", () => (
  <DashboardLinkWidget
    title="title1"
    text="this description is meant for testing purposes"
    to="/"
    buttonText="Random text"
  />
));
