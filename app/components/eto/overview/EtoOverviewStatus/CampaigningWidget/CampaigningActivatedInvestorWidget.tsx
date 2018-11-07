import * as React from "react";

import { CampaigningActivatedInvestorApprovedWidget } from "./CampaigningActivatedInvestorApprovedWidget";
import { CampaigningActivatedUnapprovedInvestorWidget } from "./CampaigningActivatedUnapprovedInvestorWidget";

import { IPledge } from "../../../../../lib/api/eto/EtoPledgeApi.interfaces";

export interface IExternalProps {
  etoId: string;
  minPledge: number;
  maxPledge?: number;
  pledge?: IPledge;
  isVerifiedInvestor: boolean;
}

const CampaigningActivatedInvestorWidget: React.SFC<IExternalProps> = ({
  isVerifiedInvestor,
  etoId,
  minPledge,
  maxPledge,
  pledge,
}) =>
  isVerifiedInvestor ? (
    <CampaigningActivatedInvestorApprovedWidget
      minPledge={minPledge}
      maxPledge={maxPledge}
      etoId={etoId}
      pledge={pledge}
    />
  ) : (
    <CampaigningActivatedUnapprovedInvestorWidget minPledge={minPledge} maxPledge={maxPledge} />
  );

export { CampaigningActivatedInvestorWidget };
