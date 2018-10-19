import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Row } from "reactstrap";
import * as mailLink from "../../../assets/img/mail_link.svg";

export const MissingEmailLightWallet: React.SFC<any> = () => {
  return (
    <>
      <Row className="justify-content-center mt-5 mb-5">
        <img src={mailLink} className="text-center" />
      </Row>
      <p className="text-center font-weight-bold" data-test-id="neuwallet-missing-email">
        <FormattedMessage id="wallet-selector.neuwallet.login-instructions" />
      </p>
    </>
  );
};
