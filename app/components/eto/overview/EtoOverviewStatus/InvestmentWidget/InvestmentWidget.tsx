import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../../../../modules/actions";
import { selectIsInvestor } from "../../../../../modules/auth/selectors";
import { selectIsAllowedToInvest } from "../../../../../modules/investment-flow/selectors";
import { TEtoWithCompanyAndContract } from "../../../../../modules/public-etos/types";
import { appConnect } from "../../../../../store";
import { withParams } from "../../../../../utils/withParams";
import { appRoutes } from "../../../../appRoutes";
import { Button, ButtonLink } from "../../../../shared/buttons";
import { Money } from "../../../../shared/Money";
import { EtoWidgetContext } from "../../../EtoWidgetView";
import { InvestmentProgress } from "./InvestmentProgress";

import * as styles from "./InvestmentWidget.module.scss";

export interface IInvestmentWidgetProps {
  eto: TEtoWithCompanyAndContract;
}

export interface IInvestmentWidgetStateProps {
  isAllowedToInvest: boolean;
  isInvestor: boolean;
}

export interface IInvestmentWidgetDispatchProps {
  startInvestmentFlow: () => void;
}

export type TInvestWidgetProps = IInvestmentWidgetProps &
  IInvestmentWidgetStateProps &
  IInvestmentWidgetDispatchProps;

const InvestmentWidgetLayout: React.SFC<TInvestWidgetProps> = ({
  startInvestmentFlow,
  eto,
  isInvestor,
  isAllowedToInvest,
}) => {
  const totalInvestors = eto.contract!.totalInvestment.totalInvestors.toNumber();

  return (
    <div className={styles.investmentWidget}>
      <div className={styles.header}>
        <div>
          <Money
            value={eto.contract!.totalInvestment.etherTokenBalance}
            currency="eth"
            className={styles.amount}
          />
          <Money
            value={eto.contract!.totalInvestment.euroTokenBalance}
            currency="eur_token"
            className={styles.amount}
          />
        </div>
        <div>
          <FormattedMessage
            id="shared-component.eto-overview.investors"
            values={{ totalInvestors }}
          />
        </div>
      </div>
      <InvestmentProgress eto={eto} />
      <EtoWidgetContext.Consumer>
        {previewCode =>
          (isInvestor || previewCode) && (
            <div className={styles.investNowButton}>
              {previewCode ? (
                <ButtonLink
                  to={withParams(appRoutes.etoPublicView, { previewCode })}
                  target="_blank"
                >
                  <FormattedMessage id="shared-component.eto-overview.invest-now" />
                </ButtonLink>
              ) : isAllowedToInvest ? (
                <Button
                  onClick={startInvestmentFlow}
                  data-test-id={`eto-invest-now-button-${eto.etoId}`}
                >
                  <FormattedMessage id="shared-component.eto-overview.invest-now" />
                </Button>
              ) : (
                <ButtonLink
                  to={appRoutes.settings}
                  data-test-id="eto-overview-settings-update-required-to-invest"
                >
                  <FormattedMessage id="shared-component.eto-overview.settings-update-required" />
                </ButtonLink>
              )}
            </div>
          )
        }
      </EtoWidgetContext.Consumer>
    </div>
  );
};

const InvestmentWidget = compose<TInvestWidgetProps, IInvestmentWidgetProps>(
  appConnect<IInvestmentWidgetStateProps, IInvestmentWidgetDispatchProps, IInvestmentWidgetProps>({
    stateToProps: state => ({
      isAllowedToInvest: selectIsAllowedToInvest(state),
      isInvestor: selectIsInvestor(state),
    }),
    dispatchToProps: (dispatch, props) => ({
      startInvestmentFlow: () => dispatch(actions.investmentFlow.startInvestment(props.eto.etoId)),
    }),
  }),
)(InvestmentWidgetLayout);

export { InvestmentWidget };
