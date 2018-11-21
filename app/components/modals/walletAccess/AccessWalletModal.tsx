import * as cn from "classnames";
import * as React from "react";
import { Modal } from "reactstrap";

import { actions } from "../../../modules/actions";
import { selectIsLightWallet, selectIsUnlocked } from "../../../modules/web3/selectors";
import { appConnect } from "../../../store";
import { TTranslatedString } from "../../../types";
import { ModalComponentBody } from "../ModalComponentBody";
import { AccessLightWalletPrompt } from "./AccessLightWalletPrompt";

import * as lockIcon from "../../../assets/img/wallet_selector/lock_icon.svg";
import * as styles from "./AccessWalletModal.module.scss";

interface IStateProps {
  errorMsg?: TTranslatedString;
  title?: TTranslatedString;
  message?: TTranslatedString;
  isLightWallet: boolean;
  isUnlocked: boolean;
}

interface IDispatchProps {
  onAccept: (password?: string) => void;
}

export const AccessWalletContainerComponent: React.SFC<IStateProps & IDispatchProps> = ({
  title,
  message,
  errorMsg,
  isUnlocked,
  onAccept,
  isLightWallet,
}) => (
  <div className="text-center">
    {title && <h1>{title}</h1>}
    {message && <p>{message}</p>}
    <img src={lockIcon} className="mb-3" />
    {isLightWallet && <AccessLightWalletPrompt onAccept={onAccept} isUnlocked={isUnlocked} />}
    {errorMsg && <p className={cn("mt-3", styles.error)}>{errorMsg}</p>}
  </div>
);

export const AccessWalletContainer = appConnect<IStateProps, IDispatchProps>({
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
      <AccessWalletContainer />
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
