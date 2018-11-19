import { storiesOf } from "@storybook/react";
import * as React from "react";

import { TagsWidgetLayout } from "./TagsWidget";

const defaultProps = {
  etoId: "1234",
  downloadDocument: () => {},
  termSheet: {} as any,
  prospectusApproved: {} as any,
  smartContractOnchain: true,
};

storiesOf("ETO/TagsWidget", module)
  .add("default", () => <TagsWidgetLayout {...defaultProps} />)
  .add("retailEto", () => <TagsWidgetLayout {...defaultProps} allowRetailEto={true} />);
