import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { SpinningEthereum } from "../../../landing/parts/SpinningEthereum";
import { Message } from "./Message";

const SigningMessage = () => (
  <Message
    data-test-id="modals.shared.signing-message.modal"
    image={<SpinningEthereum />}
    title={<FormattedMessage id="modal.shared.signing-message.title" />}
    hint={<FormattedMessage id="modal.shared.signing-message.hint" />}
  />
);

export { SigningMessage };
