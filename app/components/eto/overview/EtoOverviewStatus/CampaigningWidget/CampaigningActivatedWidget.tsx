import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { actions } from "../../../../../modules/actions";
import { selectIsInvestor, selectIsVerifiedInvestor } from "../../../../../modules/auth/selectors";
import { selectBookbuildingStats } from "../../../../../modules/bookbuilding-flow/selectors";
import { appConnect } from "../../../../../store";
import { onEnterAction } from "../../../../../utils/OnEnterAction";
import { ECurrencySymbol, EMoneyFormat, Money } from "../../../../shared/Money";
import { CampaigningActivatedInvestorWidget } from "./CampaigningActivatedInvestorWidget";
import { CampaigningActivatedUnapprovedInvestorWidget } from "./CampaigningActivatedUnapprovedInvestorWidget";

import * as styles from "../EtoOverviewStatus.module.scss";

export interface IExternalProps {
  etoId: string;
  investorsLimit: number;
  minPledge: number;
  maxPledge?: number;
}

interface IStateProps {
  pledgedAmount: number | null;
  investorsCount: number | null;
  isVerifiedInvestor: boolean;
  isInvestor: boolean;
}

type IProps = IExternalProps & IStateProps;

const CampaigningActivatedWidgetComponent: React.SFC<IProps> = ({
  investorsLimit,
  pledgedAmount,
  isInvestor,
  investorsCount,
  isVerifiedInvestor,
  etoId,
  minPledge,
  maxPledge,
}) => (
  <div className={styles.groupWrapper}>
    <div className={styles.group}>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview.amount-backed" />
      </span>
      <span className={styles.value} data-test-id="eto-bookbuilding-amount-backed">
        <Money
          value={pledgedAmount}
          currency="eur"
          format={EMoneyFormat.FLOAT}
          currencySymbol={ECurrencySymbol.SYMBOL}
        />
      </span>
    </div>
    <div className={styles.group}>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview.investors-backed" />
      </span>
      <span className={styles.value} data-test-id="eto-bookbuilding-investors-backed">
        {investorsCount !== null ? investorsCount : "-"} out of {investorsLimit} whitelisted
      </span>
    </div>
    {isInvestor &&
      (isVerifiedInvestor ? (
        <CampaigningActivatedInvestorWidget
          minPledge={minPledge}
          maxPledge={maxPledge}
          etoId={etoId}
        />
      ) : (
        <CampaigningActivatedUnapprovedInvestorWidget minPledge={minPledge} maxPledge={maxPledge} />
      ))}
  </div>
);

const CampaigningActivatedWidget = compose<React.SFC<IExternalProps>>(
  appConnect<IStateProps, {}, IExternalProps>({
    stateToProps: (state, props) => {
      const stats = selectBookbuildingStats(props.etoId, state);

      return {
        isInvestor: selectIsInvestor(state),
        isVerifiedInvestor: selectIsVerifiedInvestor(state),
        pledgedAmount: stats ? stats.pledgedAmount : null,
        investorsCount: stats ? stats.investorsCount : null,
      };
    },
  }),
  onEnterAction({
    actionCreator: (dispatch, props) => {
      dispatch(actions.bookBuilding.loadBookBuildingStats(props.etoId));
    },
  }),
)(CampaigningActivatedWidgetComponent);

export { CampaigningActivatedWidget };
