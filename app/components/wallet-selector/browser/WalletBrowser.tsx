import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { walletFlows } from "../../../modules/wallet-selector/flows";
import { selectIsLoginRoute } from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { withActionWatcher } from "../../../utils/withActionWatcher";
import { Button } from "../../shared/buttons";
import { HiResImage } from "../../shared/HiResImage";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { StepCard } from "../../shared/StepCard";
import { WarningAlert } from "../../shared/WarningAlert";

import * as browserIcon from "../../../assets/img/wallet_selector/browser_icon.svg";
import * as lockIcon from "../../../assets/img/wallet_selector/lock_icon.svg";
import * as styles from "./WalletBrowser.module.scss";

export const BROWSER_WALLET_RECONNECT_INTERVAL = 1000;

interface IWalletBrowserProps {
  errorMessage?: string;
  isLoading: boolean;
  isLoginRoute: boolean;
  approvalRejected: boolean;
}

interface IWalletBrowserDispatchProps {
  handleReset: () => void;
}

export const WalletBrowserComponent: React.SFC<
  IWalletBrowserProps & IWalletBrowserDispatchProps & IIntlProps
> = ({
  errorMessage,
  isLoading,
  isLoginRoute,
  approvalRejected,
  handleReset,
  intl: { formatIntlMessage },
}) => (
  <div>
    <h1 className="text-center mb-3" data-test-id="modals.wallet-selector.wallet-browser.title">
      {isLoginRoute ? (
        <FormattedMessage id="wallet-selector.browser.login-prompt" />
      ) : (
        <FormattedMessage id="wallet-selector.browser.register-prompt" />
      )}
    </h1>

    {isLoading ? (
      <LoadingIndicator />
    ) : (
      <div>
        <Row className="justify-content-center mb-4">
          <WarningAlert>
            <span data-test-id="browser-wallet-error-msg">{errorMessage}</span>
          </WarningAlert>
        </Row>
        {approvalRejected && (
          <>
            <Row className="justify-content-center mb-4">
              <div>
                <FormattedMessage id="wallet-selector.browser.approval-rejected" />
              </div>
            </Row>
            <Row className="justify-content-center mb-4">
              <Button onClick={handleReset}>
                <FormattedMessage id="wallet-selector.browser.approval-resend" />
              </Button>
            </Row>
          </>
        )}
        <div className={styles.stepCardWrapper}>
          <StepCard img={browserIcon} text={formatIntlMessage("wallet-selector.browser.steps.2")} />
          <StepCard img={lockIcon} text={formatIntlMessage("wallet-selector.browser.steps.3")} />
        </div>

        <HorizontalLine className="mb-4" />

        <Row className="text-center mb-4">
          <Col>
            <span className="font-weight-bold">
              <FormattedMessage id="wallet-selector.browser.supports" />
            </span>
          </Col>
        </Row>
        <Row className={cn("justify-content-center text-center", styles.walletLogos)}>
          <Col sm="auto">
            <HiResImage partialPath="wallet_selector/logo_parity" alt="Parity" title="Parity" />
          </Col>
          <Col sm="auto">
            <HiResImage partialPath="wallet_selector/logo_mist" alt="Mist" title="Mist" />
          </Col>
        </Row>
      </div>
    )}
  </div>
);

export const WalletBrowser = compose<React.SFC>(
  appConnect<IWalletBrowserProps, IWalletBrowserDispatchProps>({
    stateToProps: state => ({
      errorMessage: state.browserWalletWizardState.errorMsg,
      isLoading: state.browserWalletWizardState.isLoading,
      isLoginRoute: selectIsLoginRoute(state.router),
      approvalRejected: state.browserWalletWizardState.approvalRejected,
    }),
    dispatchToProps: dispatch => ({
      handleReset: () => dispatch(walletFlows.resetApprovalRequestBrowserWalletWizard),
    }),
  }),
  withActionWatcher({
    actionCreator: dispatch => dispatch(walletFlows.tryConnectingWithBrowserWallet),
    interval: BROWSER_WALLET_RECONNECT_INTERVAL,
  }),
  injectIntlHelpers,
)(WalletBrowserComponent);
