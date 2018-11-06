import { storiesOf } from "@storybook/react";
import * as React from "react";

import {
  CampaigningActivatedInvestorApprovedWidgetLayout,
  CampaigningFormState,
} from "./CampaigningActivatedInvestorApprovedWidgetLayout";

storiesOf("CampaigningActivatedInvestorApprovedWidgetLayout", module).add("default", () => (
  <>
    <CampaigningActivatedInvestorApprovedWidgetLayout
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
