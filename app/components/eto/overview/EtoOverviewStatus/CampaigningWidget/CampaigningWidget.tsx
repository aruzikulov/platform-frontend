import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { selectIsAuthorized } from "../../../../../modules/auth/selectors";
import { appConnect } from "../../../../../store";
import { appRoutes } from "../../../../appRoutes";
import { ButtonLink } from "../../../../shared/buttons";
import { CampaigningActivatedWidget } from "./CampaigningActivatedWidget";

import * as styles from "../EtoOverviewStatus.module.scss";

export interface ICampaigningWidget {
  investorsLimit: number;
  isActivated: boolean;
  quote: string | undefined;
  minPledge: number;
  maxPledge?: number;
}

interface IExternalProps {
  etoId: string;
}

interface IStateProps {
  isAuthorized: boolean;
}

export interface ILoggedInCampaigningProps {
  investorsLimit: number;
  isActivated: boolean;
  quote: string | undefined;
  etoId: string;
  minPledge: number;
  maxPledge?: number;
}

const LoggedInCampaigning: React.SFC<ILoggedInCampaigningProps> = ({
  isActivated,
  quote,
  etoId,
  investorsLimit,
  minPledge,
  maxPledge,
}) => {
  return isActivated ? (
    <CampaigningActivatedWidget
      etoId={etoId}
      minPledge={minPledge}
      maxPledge={maxPledge}
      investorsLimit={investorsLimit}
    />
  ) : (
    <div className={styles.quote}>{quote}</div>
  );
};

const LoggedOutCampaigning: React.SFC = () => {
  return (
    <div className={styles.registerNow}>
      <div>
        <FormattedMessage id="shared-component.eto-overview.register-cta" />
      </div>
      <ButtonLink className="mt-3" to={appRoutes.register}>
        <FormattedMessage id="shared-component.eto-overview.register" />
      </ButtonLink>
    </div>
  );
};

export const CampaigningWidgetLayout: React.SFC<
  IExternalProps & ICampaigningWidget & IStateProps
> = ({ etoId, investorsLimit, isActivated, quote, isAuthorized, minPledge, maxPledge }) =>
  isAuthorized ? (
    <LoggedInCampaigning
      maxPledge={maxPledge}
      minPledge={minPledge}
      etoId={etoId}
      isActivated={isActivated}
      quote={quote}
      investorsLimit={investorsLimit}
    />
  ) : (
    <LoggedOutCampaigning />
  );

export const CampaigningWidget = compose<React.SFC<IExternalProps & ICampaigningWidget>>(
  appConnect<IStateProps>({
    stateToProps: state => ({
      isAuthorized: selectIsAuthorized(state.auth),
    }),
  }),
)(CampaigningWidgetLayout);
