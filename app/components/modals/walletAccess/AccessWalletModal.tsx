import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Modal } from "reactstrap";

import { actions } from "../../../modules/actions";
import { selectIsLightWallet, selectIsUnlocked } from "../../../modules/web3/selectors";
import { appConnect } from "../../../store";
import { Button } from "../../shared/buttons";
import { ModalComponentBody } from "../ModalComponentBody";
import { AccessLightWalletPrompt } from "./AccessLightWalletPrompt";

import * as lockIcon from "../../../assets/img/wallet_selector/lock_icon.svg";
import * as styles from "./AccessWalletModal.module.scss";

interface IStateProps {
  errorMsg?: string | React.ReactNode;
  title?: string | React.ReactNode;
  message?: string | React.ReactNode;
  isLightWallet: boolean;
  isUnlocked: boolean;
}

interface IDispatchProps {
  onAccept: (password?: string) => void;
}

interface IOwnProps {
  onCancel?: () => void;
}

const GenericSignPrompt = ({ onCancel }: { onCancel?: () => void }) => (
  <div className="text-md-center">
    {onCancel && (
      <Button onClick={onCancel}>
        <FormattedMessage id="form.button.cancel" />
      </Button>
    )}
  </div>
);

export const AccessWalletContainerComponent: React.SFC<
  IStateProps & IDispatchProps & IOwnProps
> = props => (
  <div className="text-center">
    {props.title && <h1>{props.title}</h1>}
    {props.message && <p>{props.message}</p>}
    <img src={lockIcon} className="mb-3" />
    {props.isLightWallet ? (
      <AccessLightWalletPrompt {...props} />
    ) : (
      <GenericSignPrompt onCancel={props.onCancel} />
    )}
    {props.errorMsg && <p className={cn("mt-3", styles.error)}>{props.errorMsg}</p>}
  </div>
);

export const AccessWalletContainer = appConnect<IStateProps, IDispatchProps, IOwnProps>({
  stateToProps: s => ({
    isOpen: s.accessWallet.isModalOpen,
    errorMsg: s.accessWallet.modalErrorMsg,
    title: s.accessWallet.modalTitle,
    message: s.accessWallet.modalMessage,
    isLightWallet: selectIsLightWallet(s.web3),
    isUnlocked: selectIsUnlocked(s.web3),
  }),
  dispatchToProps: dispatch => ({
    onAccept: (password?: string) => dispatch(actions.signMessageModal.accept(password)),
  }),
})(AccessWalletContainerComponent);

interface IModalStateProps {
  isOpen: boolean;
}

interface IModalDispatchProps {
  onCancel: () => void;
}

const AccessWalletModalComponent: React.SFC<IModalStateProps & IModalDispatchProps> = props => (
  <Modal isOpen={props.isOpen} toggle={props.onCancel} centered>
    <ModalComponentBody onClose={props.onCancel}>
      <AccessWalletContainer onCancel={props.onCancel} />
    </ModalComponentBody>
  </Modal>
);

export const AccessWalletModal = appConnect<IModalStateProps, IModalDispatchProps>({
  stateToProps: s => ({
    isOpen: s.accessWallet.isModalOpen,
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.signMessageModal.hideAccessWalletModal()),
  }),
})(AccessWalletModalComponent);
