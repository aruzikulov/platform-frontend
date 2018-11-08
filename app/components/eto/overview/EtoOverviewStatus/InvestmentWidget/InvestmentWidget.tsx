import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../../modules/actions";
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

export interface IInvestmentWidgetDispatchProps {
  startInvestmentFlow: () => void;
}

export type TInvestWidgetProps = IInvestmentWidgetProps & IInvestmentWidgetDispatchProps;

const InvestmentWidgetLayout: React.SFC<TInvestWidgetProps> = ({ startInvestmentFlow, eto }) => {
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
      <div className={styles.investNowButton}>
        <EtoWidgetContext.Consumer>
          {previewCode =>
            previewCode ? (
              <ButtonLink to={withParams(appRoutes.etoPublicView, { previewCode })} target="_blank">
                <FormattedMessage id="shared-component.eto-overview.invest-now" />
              </ButtonLink>
            ) : (
              <Button
                onClick={startInvestmentFlow}
                data-test-id={`eto-invest-now-button-${eto.etoId}`}
              >
                <FormattedMessage id="shared-component.eto-overview.invest-now" />
              </Button>
            )
          }
        </EtoWidgetContext.Consumer>
      </div>
    </div>
  );
};

const InvestmentWidget = appConnect<{}, IInvestmentWidgetDispatchProps, IInvestmentWidgetProps>({
  dispatchToProps: (dispatch, props) => ({
    startInvestmentFlow: () => dispatch(actions.investmentFlow.startInvestment(props.eto.etoId)),
  }),
})(InvestmentWidgetLayout);

export { InvestmentWidget };
