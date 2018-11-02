import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { ledgerWizardFlows } from "../../../modules/wallet-selector/ledger-wizard/flows";
import { appConnect } from "../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { withActionWatcher } from "../../../utils/withActionWatcher";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { WarningAlert } from "../../shared/WarningAlert";
import { LedgerHeader } from "./LedgerHeader";

import * as imgStep1 from "../../../assets/img/wallet_selector/ledger_login_step_1.svg";
import * as imgStep2 from "../../../assets/img/wallet_selector/ledger_login_step_2.svg";
import * as imgStep3 from "../../../assets/img/wallet_selector/ledger_login_step_3.svg";
import * as imgStep4 from "../../../assets/img/wallet_selector/ledger_login_step_4.svg";
import * as imgStep5 from "../../../assets/img/wallet_selector/ledger_login_step_5.svg";
import * as imgStep6 from "../../../assets/img/wallet_selector/ledger_login_step_6.svg";
import * as styles from "./WalletLedgerInitComponent.module.scss";

export const LEDGER_RECONNECT_INTERVAL = 2000;

interface IInitStep {
  header: string;
  img: string;
  desc: string;
}

const InitStep: React.SFC<IInitStep> = ({ header, img, desc }) => (
  <Col xs="12" md="4" className={cn("mb-4 mb-md-0 px-4", styles.step)}>
    <div className={styles.header}>{header}</div>
    <img className="my-2 my-md-5" src={img} />
    <p>{desc}</p>
  </Col>
);

interface IWalletLedgerInitComponentProps {
  isInitialConnectionInProgress: boolean;
  errorMessage?: string;
}

interface IWalletLedgerInitComponentState {
  showLedgerBrowserSupport: boolean;
}

export class WalletLedgerInitComponent extends React.Component<
  IWalletLedgerInitComponentProps & IIntlProps,
  IWalletLedgerInitComponentState
> {
  state = {
    showLedgerBrowserSupport: false,
  };

  handleShowSupport = () => {
    this.setState(s => ({
      showLedgerBrowserSupport: !s.showLedgerBrowserSupport,
    }));
  };

  render(): React.ReactNode {
    if (this.props.isInitialConnectionInProgress) {
      return <LoadingIndicator />;
    }
    return (
      <>
        <Row>
          <Col>
            <LedgerHeader />
          </Col>
        </Row>
        {this.props.errorMessage && (
          <Row className="justify-content-center">
            <WarningAlert className="my-4">
              <FormattedMessage id="wallet-selector.ledger.start.connection-status" />{" "}
              <span data-test-id="ledger-wallet-error-msg">{this.props.errorMessage}</span>
            </WarningAlert>
          </Row>
        )}
        <Row>
          <InitStep
            header={this.props.intl.formatIntlMessage("wallet-selector.ledger.start.step1.header")}
            img={imgStep1}
            desc={this.props.intl.formatIntlMessage(
              "wallet-selector.ledger.start.step1.description",
            )}
          />
          <InitStep
            header={this.props.intl.formatIntlMessage("wallet-selector.ledger.start.step2.header")}
            img={imgStep2}
            desc={this.props.intl.formatIntlMessage(
              "wallet-selector.ledger.start.step2.description",
            )}
          />
          <InitStep
            header={this.props.intl.formatIntlMessage("wallet-selector.ledger.start.step3.header")}
            img={imgStep3}
            desc={this.props.intl.formatIntlMessage(
              "wallet-selector.ledger.start.step3.description",
            )}
          />
        </Row>
        <Row className={cn("justify-content-center", styles.ledgerBrowser)}>
          <button
            onClick={this.handleShowSupport}
            className={cn(
              styles.drawerButton,
              this.state.showLedgerBrowserSupport ? "mt-3 mb-4" : "mt-3",
            )}
          >
            <FormattedMessage id="wallet-selector.ledger.start.browser-support" />
            <i
              aria-hidden="true"
              className={cn(
                "fa fa-lg ml-3",
                this.state.showLedgerBrowserSupport ? "fa-angle-up" : "fa-angle-down",
              )}
            />
          </button>
        </Row>
        {this.state.showLedgerBrowserSupport && (
          <Row>
            <InitStep
              header={this.props.intl.formatIntlMessage(
                "wallet-selector.ledger.start.step4.header",
              )}
              img={imgStep4}
              desc={this.props.intl.formatIntlMessage(
                "wallet-selector.ledger.start.step4.description",
              )}
            />
            <InitStep
              header={this.props.intl.formatIntlMessage(
                "wallet-selector.ledger.start.step5.header",
              )}
              img={imgStep5}
              desc={this.props.intl.formatIntlMessage(
                "wallet-selector.ledger.start.step5.description",
              )}
            />
            <InitStep
              header={this.props.intl.formatIntlMessage(
                "wallet-selector.ledger.start.step6.header",
              )}
              img={imgStep6}
              desc={this.props.intl.formatIntlMessage(
                "wallet-selector.ledger.start.step6.description",
              )}
            />
          </Row>
        )}
      </>
    );
  }
}

export const WalletLedgerInit = compose<React.SFC>(
  withActionWatcher({
    actionCreator: dispatch => dispatch(ledgerWizardFlows.tryEstablishingConnectionWithLedger),
    interval: LEDGER_RECONNECT_INTERVAL,
  }),
  appConnect<IWalletLedgerInitComponentProps>({
    stateToProps: state => ({
      isInitialConnectionInProgress: state.ledgerWizardState.isInitialConnectionInProgress,
      errorMessage: state.ledgerWizardState.errorMsg,
    }),
  }),
  injectIntlHelpers,
)(WalletLedgerInitComponent);
