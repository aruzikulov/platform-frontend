import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EValidationState } from "../../../../modules/tx/sender/reducer";
import { Message } from "./Message";

interface IProps {
  type?: EValidationState;
}

const getValidationMessageByType = (type?: EValidationState) => {
  switch (type) {
    case EValidationState.NOT_ENOUGH_ETHER_FOR_GAS:
      return <FormattedMessage id="modal.txsender.error-message.not-enough-ether-for-gas" />;
    //Add more validation errors
  }
};

const ValidationErrorMessage: React.SFC<IProps> = ({ type }) => {
  return (
    <Message
      data-test-id="modals.shared.validation-message"
      hint={getValidationMessageByType(type)}
    />
  );
};

export { ValidationErrorMessage };
