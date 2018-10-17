import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Message } from "./Message";

import * as failedImg from "../../../../assets/img/ether_fail.svg";
import * as styles from "./ErrorMessage.module.scss";

const ErrorMessage: React.SFC = () => {
  return (
    <Message
      data-test-id="modals.shared.signing-message.modal"
      image={<img src={failedImg} className={styles.eth} />}
      title={<FormattedMessage id="modal.shared.signing-message.transaction-error.title" />}
      hint={<FormattedMessage id="modal.shared.signing-message.transaction-error.hint" />}
    />
  );
};

export { ErrorMessage };
