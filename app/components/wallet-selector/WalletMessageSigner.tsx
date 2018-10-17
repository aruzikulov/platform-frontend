import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../modules/actions";
import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { Button } from "../shared/buttons";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { WarningAlert } from "../shared/WarningAlert";
import { MessageSignPrompt } from "../signing/MessageSignPrompt";
import * as styles from "./WalletMessageSigner.module.scss";

interface IStateProps {
  errorMsg?: string;
  isLightWallet: boolean;
}

interface IDispatchProps {
  cancelSigning: () => void;
}

interface IOwnProps {
  rootPath: string;
}

export const MessageSignerComponent: React.SFC<IStateProps & IDispatchProps> = ({
  errorMsg,
  cancelSigning,
  isLightWallet,
}) => {
  // short circuit process for light wallet since it will be automatic
  if (!errorMsg && isLightWallet) {
    return <LoadingIndicator className={styles.spinner} />;
  }

  return (
    <>
      <MessageSignPrompt />
      {errorMsg ? (
        <Row className="justify-content-center">
          <Col>
            <WarningAlert className="my-4 text-center">{errorMsg}</WarningAlert>
          </Col>
        </Row>
      ) : (
        <LoadingIndicator className={styles.spinner} />
      )}
      <Row>
        <Col className="text-center">
          <Button onClick={cancelSigning}>
            <FormattedMessage id="form.button.cancel" />
          </Button>
        </Col>
      </Row>
    </>
  );
};
MessageSignerComponent.displayName = "MessageSignerComponent";

export const WalletMessageSigner = compose(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: state => ({
      errorMsg: state.walletSelector.messageSigningError,
      isLightWallet: selectIsLightWallet(state.web3),
    }),
    dispatchToProps: (dispatch, ownProps) => ({
      cancelSigning: () => {
        dispatch(actions.walletSelector.reset());
        dispatch(actions.routing.goTo(ownProps.rootPath));
      },
    }),
  }),
)(MessageSignerComponent);
