import * as cn from "classnames";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { walletFlows } from "../../../modules/wallet-selector/flows";
import { appConnect } from "../../../store";
import { withActionWatcher } from "../../../utils/withActionWatcher";
import { ButtonArrowRight } from "../../shared/Buttons";
import { HiResImage } from "../../shared/HiResImage";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { StepCard } from "../../shared/StepCard";
import { WarningAlert } from "../../shared/WarningAlert";

import * as browserIcon from "../../../assets/img/wallet_selector/browser_icon.svg";
import * as lockIcon from "../../../assets/img/wallet_selector/lock_icon.svg";
import * as walletIcon from "../../../assets/img/wallet_selector/wallet_icon.svg";

import { FormattedMessage } from "react-intl-phraseapp";
import { selectIsLoginRoute } from "../../../modules/wallet-selector/selectors";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
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
    <h1 className="text-center mb-3">
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
              <ButtonArrowRight onClick={handleReset}>
                <FormattedMessage id="wallet-selector.browser.approval-resend" />
              </ButtonArrowRight>
            </Row>
          </>
        )}
        <Row className="mb-4 text-center">
          <StepCard img={walletIcon} text={formatIntlMessage("wallet-selector.browser.steps.1")} />
          <StepCard img={browserIcon} text={formatIntlMessage("wallet-selector.browser.steps.2")} />
          <StepCard img={lockIcon} text={formatIntlMessage("wallet-selector.browser.steps.3")} />
        </Row>

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
            <HiResImage
              partialPath="wallet_selector/logo_metamask"
              alt="Metamask"
              title="Metamask"
            />
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
