import { storiesOf } from "@storybook/react";
import * as React from "react";

import {
  CampaigningActivatedInvestorWidgetLayout,
  CampaigningFormState,
} from "./CampaigningActivatedInvestorWidgetLayout";

storiesOf("CampaigningActivatedInvestorWidgetLayout", module).add("default", () => (
  <>
    <CampaigningActivatedInvestorWidgetLayout
      pledgedAmount={10}
      consentToRevealEmail={true}
      backNow={() => "back now"}
      formState={CampaigningFormState.VIEW}
      showMyEmail={() => {}}
      changePledge={() => {}}
      deletePledge={() => {}}
      minPledge={2}
      maxPledge={100}
    />
  </>
));
