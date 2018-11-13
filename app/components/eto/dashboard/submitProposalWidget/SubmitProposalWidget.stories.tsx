import { storiesOf } from "@storybook/react";
import * as React from "react";

import { SubmitProposalWidgetComponent } from "./SubmitProposalWidget";

storiesOf("SubmitProposalWidget", module).add("default", () => (
  <SubmitProposalWidgetComponent submitProposal={() => {}} />
));
