import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";

import {
  selectIcbmWalletConnected,
  selectLockedWalletConnected,
  selectNeuBalance,
  selectNeuBalanceEuroAmount,
} from "../../../modules/wallet/selectors";
import { appConnect } from "../../../store";
import { CommonHtmlProps } from "../../../types";
import { appRoutes } from "../../appRoutes";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { Panel } from "../../shared/Panel";
import { WarningAlert } from "../../shared/WarningAlert";
import { MyNeuWidget } from "./MyNeuWidget";

import * as styles from "./MyPortfolioWidget.module.scss";

type TOwnProps = CommonHtmlProps;

interface IBodyProps {
  error?: string;
  balanceNeu: string;
  balanceEur: string;
  isIcbmWalletConnected?: boolean;
  isLockedWalletConnected?: boolean;
}

interface IStateProps {
  isLoading: boolean;
  balanceNeu?: string;
  balanceEur?: string;
  error?: string;
  isIcbmWalletConnected?: boolean;
  isLockedWalletConnected?: boolean;
}

type IProps = TOwnProps & IStateProps;

export const MyPortfolioWidgetComponentBody: React.SFC<IBodyProps> = ({
  error,
  isIcbmWalletConnected,
  isLockedWalletConnected,
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
        {process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED === "1" && (
          <>
            {!(isIcbmWalletConnected || isLockedWalletConnected) && (
              <p>
                <FormattedMessage id="dashboard.my-portfolio-widget.cant-see-your-icbm-wallet" />{" "}
                <Link to={appRoutes.settings} className={styles.link}>
                  <FormattedMessage id="dashboard.my-portfolio-widget.check-it-here" />
                </Link>
              </p>
            )}
          </>
        )}
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
  isIcbmWalletConnected,
  isLockedWalletConnected,
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
              isIcbmWalletConnected,
              isLockedWalletConnected,
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
    isIcbmWalletConnected: selectIcbmWalletConnected(s.wallet),
    isLockedWalletConnected: selectLockedWalletConnected(s.wallet),
  }),
})(MyPortfolioWidgetComponent);
