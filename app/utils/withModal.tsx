// import * as React from "react";
// import { ComponentEnhancer, nest } from "recompose";
// import { Col, Modal, Row } from "reactstrap";
// import * as ipfsImage from "*.png";
// import * as styles from "*.scss";
// import { FormattedMessage } from "react-intl-phraseapp";
// import { appConnect } from "../store";
// import { ModalComponentBody } from "../components/modals/ModalComponentBody";
// import { actions } from "../modules/actions";
// import { selectGenericModalIsOpen } from "../modules/generic-modal/reducer";
//
// export const EtoFileIpfsModalComponent: React.SFC<any & any> = ({
//   onDismiss,
//   isOpen,
//   children,
// }) => {
//   return (
//     <Modal isOpen={isOpen} toggle={onDismiss} centered>
//       <ModalComponentBody onClose={onDismiss}>{children}</ModalComponentBody>
//     </Modal>
//   );
// };
//
// export function withModal(id: Symbol) {
//   return (Layout: React.ReactType) =>
//     appConnect<any, any>({
//       stateToProps: state => ({
//         isOpen: selectGenericModalId(state.genericModal) === id,
//       }),
//       dispatchToProps: dispatch => ({
//         onDismiss: () => dispatch(actions.genericModal.hideGenericModal()),
//       }),
//     })(EtoFileIpfsModalComponent);
// }
