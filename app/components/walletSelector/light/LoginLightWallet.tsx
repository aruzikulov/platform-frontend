import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import {
  selectLightWalletEmailFromQueryString,
  selectPreviousLightWalletEmail,
} from "../../../modules/web3/selectors";
import { appConnect } from "../../../store";
import { LoginWithEmailLightWallet } from "./LoginWithEmailLightWallet";
import { MissingEmailLightWallet } from "./MissingEmailLightWallet";

interface IStateProps {
  email?: string;
}

export const LoginLightWalletComponent: React.SFC<IStateProps> = ({ email }) => (
  <Row className="justify-content-sm-center mb-5">
    <Col xs="12" md="5" className="align-self-end">
      <h1
        className="text-center mb-4"
        data-test-id="modals.wallet-selector.login-light-wallet.title"
      >
        <FormattedMessage id="wallet-selector.neuwallet.welcome" />
      </h1>

      {email ? <LoginWithEmailLightWallet email={email} /> : <MissingEmailLightWallet />}
    </Col>
  </Row>
);

export const LoginLightWallet = appConnect<IStateProps>({
  stateToProps: s => ({
    email:
      selectLightWalletEmailFromQueryString(s.router) || selectPreviousLightWalletEmail(s.web3),
  }),
})(LoginLightWalletComponent);
