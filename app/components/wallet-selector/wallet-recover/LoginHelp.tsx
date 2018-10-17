import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

import { ButtonLink } from "../../shared/buttons";
import { loginWalletRoutes } from "../walletRoutes";
import { recoverRoutes } from "./recoverRoutes";

export const LoginHelp: React.SFC<void> = () => (
  <div>
    <Col className="mt-5 mb-5">
      <h2 className="font-weight-bold mx-auto text-center">
        <FormattedMessage id="wallet-selector.recover.help.prompt" />
      </h2>
    </Col>
    <Col md={10} className="mb-5 mt-5 offset-md-1 ">
      <h5 className="font-weight-bold mb-2">
        <FormattedMessage id="wallet-selector.recover.help.wallet-id-missing" />
      </h5>
      <p>
        <FormattedMessage id="wallet-selector.recover.help.email-login" />
      </p>
      <div className="border-bottom pb-4" />
    </Col>
    <Col md={10} className="mb-5 mt-5 offset-md-1">
      <Row className="justify-content-between" noGutters>
        <div>
          <h5 className="font-weight-bold">
            <FormattedMessage id="wallet-selector.recover.help.password-forgotten" />
          </h5>
          <p>
            <FormattedMessage id="wallet-selector.recover.help.recover-with-passphrase" />
          </p>
        </div>
        <Col xs={12} md={4}>
          <ButtonLink to={recoverRoutes.seed}>
            <FormattedMessage id="wallet-selector.recover.help.recover-button" />
          </ButtonLink>
        </Col>
      </Row>
      <div className="border-bottom pb-4" />
    </Col>
    <Col md={10} className="mt-5 mb-5 offset-md-1">
      <Row className="justify-content-between" noGutters>
        <h5 className="font-weight-bold">
          <FormattedMessage id="wallet-selector.recover.help.ledger-lost" />
        </h5>
        <Col xs={12} md={4}>
          <ButtonLink to="/">
            <FormattedMessage id="wallet-selector.recover.help.ledger-lost-btn" />
          </ButtonLink>
        </Col>
      </Row>
    </Col>
    <Col md={12}>
      <Row className="ml-2 mt-5 pt-5 mr-2 justify-content-between align-items-center">
        <Link to={loginWalletRoutes.light}>
          <i className="fa fa-lg fa-angle-left mr-1" /> BACK
        </Link>
        <a href="https://support.neufund.org/support/home">
          <FormattedMessage id="wallet-selector.recover.help.contact-for-help" />{" "}
          <i className="fa fa-lg fa-angle-right ml-1" />
        </a>
      </Row>
    </Col>
  </div>
);
