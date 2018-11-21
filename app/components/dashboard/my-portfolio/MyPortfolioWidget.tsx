import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { selectNeuBalance, selectNeuBalanceEuroAmount } from "../../../modules/wallet/selectors";
import { appConnect } from "../../../store";
import { CommonHtmlProps } from "../../../types";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { Panel } from "../../shared/Panel";
import { WarningAlert } from "../../shared/WarningAlert";
import { MyNeuWidget } from "./MyNeuWidget";

import * as styles from "./MyPortfolioWidget.module.scss";

type TOwnProps = CommonHtmlProps;

interface IBodyProps {
  error?: string;
  balanceNeu: string;
  balanceEur: string;
}

interface IStateProps {
  isLoading: boolean;
  balanceNeu?: string;
  balanceEur?: string;
  error?: string;
}

type IProps = TOwnProps & IStateProps;

export const MyPortfolioWidgetComponentBody: React.SFC<IBodyProps> = ({
  error,
  balanceEur,
  balanceNeu,
}) => {
  if (error) {
    return <WarningAlert>{error}</WarningAlert>;
  }

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.main}>
        <h3>
          <FormattedMessage id="dashboard.my-portfolio-widget.welcome" />
        </h3>
      </div>
      <MyNeuWidget balanceNeu={balanceNeu} balanceEur={balanceEur} />
    </div>
  );
};

export const MyPortfolioWidgetComponent: React.SFC<IProps> = ({
  className,
  style,
  isLoading,
  error,
  balanceEur,
  balanceNeu,
}) => {
  return (
    <Panel
      headerText={
        <FormattedMessage id="components.dashboard.my-portfolio.my-portfolio-widget.header-text" />
      }
      className={className}
      style={style}
    >
      <>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <MyPortfolioWidgetComponentBody
            {...{
              balanceEur: balanceEur!,
              balanceNeu: balanceNeu!,
            }}
            error={error}
            test-data-id="dashboard-my-portfolio-widget"
          />
        )}
      </>
    </Panel>
  );
};

export const MyPortfolioWidget = appConnect<IStateProps, {}, TOwnProps>({
  stateToProps: s => ({
    isLoading: s.wallet.loading,
    error: s.wallet.error,
    balanceNeu: selectNeuBalance(s.wallet),
    balanceEur: selectNeuBalanceEuroAmount(s),
  }),
})(MyPortfolioWidgetComponent);
