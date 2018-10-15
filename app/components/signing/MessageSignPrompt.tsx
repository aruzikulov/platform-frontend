import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { selectConnectedWeb3State } from "../../modules/web3/selectors";
import { EWalletType } from "../../modules/web3/types";
import { appConnect } from "../../store";

import * as ledgerConfirm from "../../assets/img/wallet_selector/ledger_confirm.svg";
import * as walletConfirmIcon from "../../assets/img/wallet_selector/wallet_confirm_icon.svg";

interface IStateProps {
  walletType: EWalletType;
}

export const BrowserWalletMessageSignPrompt: React.SFC = () => (
  <Row className="text-center">
    <Col>
      <h1>
        <FormattedMessage id="signing.browser-wallet.header" />
      </h1>
      <img className="mt-5 mb-4" src={walletConfirmIcon} />
      <p className="font-weight-bold">
        <FormattedMessage id="signing.browser-wallet.message" />
      </p>
    </Col>
  </Row>
);

export const LedgerWalletMessageSignPrompt: React.SFC = () => (
  <Row className="text-center">
    <Col>
      <h1>
        <FormattedMessage id="signing.ledger-wallet.header" />
      </h1>
      <img className="mt-5 mb-4" src={ledgerConfirm} />
      <p className="font-weight-bold">
        <FormattedMessage id="signing.ledger-wallet.message" />
      </p>
    </Col>
  </Row>
);

export const MessageSignPromptComponent: React.SFC<IStateProps> = ({ walletType }) => {
  return walletType === EWalletType.LEDGER ? (
    <LedgerWalletMessageSignPrompt />
  ) : (
    <BrowserWalletMessageSignPrompt />
  );
};

export const MessageSignPrompt = appConnect<IStateProps>({
  stateToProps: s => ({
    walletType: selectConnectedWeb3State(s.web3).wallet.walletType,
  }),
})(MessageSignPromptComponent);
