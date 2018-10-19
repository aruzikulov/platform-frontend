import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { appRoutes } from "../../../../appRoutes";
import { ButtonLink } from "../../../../shared/buttons";
import { CampaigningActivatedWidget } from "./CampaigningActivatedWidget";

import * as styles from "../EtoOverviewStatus.module.scss";

export interface ICampaigningWidget {
  investorsLimit: number;
  isActivated: boolean;
  minPledge: number;
  maxPledge?: number;
}

export interface ILoggedInCampaigningProps {
  investorsLimit: number;
  etoId: string;
  minPledge: number;
  maxPledge?: number;
}

const LoggedInCampaigning: React.SFC<ILoggedInCampaigningProps> = ({
  etoId,
  investorsLimit,
  minPledge,
  maxPledge,
}) => {
  return (
    <CampaigningActivatedWidget
      etoId={etoId}
      minPledge={minPledge}
      maxPledge={maxPledge}
      investorsLimit={investorsLimit}
    />
  );
};

const LoggedOutCampaigning: React.SFC = () => {
  return (
    <div className={styles.registerNow}>
      <div>
        <FormattedMessage id="shared-component.eto-overview.register-cta" />
      </div>
      <ButtonLink
        className="mt-3"
        to={appRoutes.register}
        data-test-id="logged-out-campaigning-register"
      >
        <FormattedMessage id="shared-component.eto-overview.register" />
      </ButtonLink>
    </div>
  );
};

export { LoggedOutCampaigning, LoggedInCampaigning };
