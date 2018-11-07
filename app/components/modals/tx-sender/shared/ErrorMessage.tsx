import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETransactionErrorType } from "../../../../modules/tx/sender/reducer";
import { Message } from "./Message";

import * as failedImg from "../../../../assets/img/ether_fail.svg";
import * as styles from "./ErrorMessage.module.scss";

interface IProps {
  type?: ETransactionErrorType;
}

const getErrorMessageByType = (type?: ETransactionErrorType) => {
  switch (type) {
    case ETransactionErrorType.ERROR_WHILE_WATCHING_TX:
      return <FormattedMessage id="modal.txsender.error-message.error-while-watching-tx" />;
    case ETransactionErrorType.FAILED_TO_GENERATE_TX:
      return <FormattedMessage id="modal.txsender.error-message.failed-to-generate-tx" />;
    case ETransactionErrorType.GAS_TOO_LOW:
      return <FormattedMessage id="modal.txsender.error-message.gas-too-low" />;
    case ETransactionErrorType.INVALID_CHAIN_ID:
      return <FormattedMessage id="modal.txsender.error-message.invalid-chain-id" />;
    case ETransactionErrorType.INVALID_RLP_TX:
      return <FormattedMessage id="modal.txsender.error-message.invalid-rlp-tx" />;
    case ETransactionErrorType.NOT_ENOUGH_ETHER_FOR_GAS:
      return <FormattedMessage id="modal.txsender.error-message.not-enough-ether-for-gas" />;
    case ETransactionErrorType.NONCE_TOO_LOW:
      return <FormattedMessage id="modal.txsender.error-message.nonce-too-low" />;
    case ETransactionErrorType.NOT_ENOUGH_FUNDS:
      return <FormattedMessage id="modal.txsender.error-message.not-enough-funds" />;
    case ETransactionErrorType.OUT_OF_GAS:
      return <FormattedMessage id="modal.txsender.error-message.out-of-gas" />;
    case ETransactionErrorType.REVERTED_TX:
      return <FormattedMessage id="modal.txsender.error-message.reverted-tx" />;
    case ETransactionErrorType.TOO_MANY_TX_IN_QUEUE:
      return <FormattedMessage id="modal.txsender.error-message.too-many-tx-in-queue" />;
    case ETransactionErrorType.TX_WAS_REJECTED:
      return <FormattedMessage id="modal.txsender.error-message.tx-was-rejected" />;
  }
  return <FormattedMessage id="modal.shared.signing-message.transaction-error.hint" />;
};

const ErrorMessage: React.SFC<IProps> = ({ type }) => {
  return (
    <Message
      data-test-id="modals.shared.signing-message.modal"
      image={<img src={failedImg} className={styles.eth} />}
      title={<FormattedMessage id="modal.shared.signing-message.transaction-error.title" />}
      hint={getErrorMessageByType(type)}
    />
  );
};

export { ErrorMessage };
