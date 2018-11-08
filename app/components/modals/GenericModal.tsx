import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Modal, Row } from "reactstrap";
import { compose, setDisplayName, withHandlers } from "recompose";

import { actions } from "../../modules/actions";
import {
  IGenericModal,
  selectGenericModalComponent,
  selectGenericModalIsOpen,
  selectGenericModalObj,
} from "../../modules/generic-modal/reducer";
import { appConnect, AppDispatch } from "../../store";
import { Button } from "../shared/buttons";
import { ModalComponentBody } from "./ModalComponentBody";

import * as successIcon from "../../assets/img/notifications/Success_small.svg";
import * as warningIcon from "../../assets/img/notifications/warning.svg";
import * as styles from "./GenericModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  genericModalObj?: IGenericModal;
  component?: React.ReactType;
}

interface IHandlersProps {
  closeModal: () => void;
  onClick: () => void;
}

export const genericModalIcons = {
  check: <img src={successIcon} className={styles.icon} aria-hidden="true" />,
  exclamation: <img src={warningIcon} className={styles.icon} aria-hidden="true" />,
};

const GenericModalComponent: React.SFC<IStateProps & IHandlersProps> = ({
  onClick,
  closeModal,
  isOpen,
  genericModalObj,
  component: Component,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={closeModal} centered>
      <ModalComponentBody onClose={closeModal}>
        {Component ? (
          <Component closeModal={closeModal} />
        ) : (
          <>
            <Row className="mt-5 justify-content-center">
              <h5 data-test-id="components.modals.generic-modal.title">
                {genericModalObj && genericModalObj.title}
              </h5>
            </Row>

            <Row className="mb-5 justify-content-center">
              <div className={styles.content}>
                {genericModalObj && genericModalObj.icon && genericModalIcons[genericModalObj.icon]}{" "}
                {genericModalObj && genericModalObj.description}
              </div>
            </Row>

            <Row className="mb-5 justify-content-center">
              <Button onClick={onClick} data-test-id="generic-modal-dismiss-button">
                {genericModalObj && genericModalObj.actionLinkText ? (
                  genericModalObj.actionLinkText
                ) : (
                  <FormattedMessage id="modal.generic.button.dismiss" />
                )}
              </Button>
            </Row>
          </>
        )}
      </ModalComponentBody>
    </Modal>
  );
};

interface IReduxProps {
  dispatch: AppDispatch;
}

export const GenericModal = compose<IStateProps & IHandlersProps, {}>(
  setDisplayName("GenericModal"),
  appConnect<IStateProps>({
    stateToProps: state => ({
      isOpen: selectGenericModalIsOpen(state.genericModal),
      genericModalObj: selectGenericModalObj(state.genericModal),
      component: selectGenericModalComponent(state.genericModal),
    }),
  }),
  withHandlers<IStateProps & IReduxProps, IHandlersProps>({
    closeModal: ({ dispatch }) => () => dispatch(actions.genericModal.hideGenericModal()),
    onClick: ({ genericModalObj, dispatch }) => () => {
      dispatch(actions.genericModal.hideGenericModal());

      if (genericModalObj && genericModalObj.onClickAction) {
        dispatch(genericModalObj.onClickAction);
      }
    },
  }),
)(GenericModalComponent);
