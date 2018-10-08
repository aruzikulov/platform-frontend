import * as React from "react";
import { Modal } from "reactstrap";

import { actions } from "../../modules/actions";
import {
  IPersonProfileModal,
  selectIsOpen,
  selectPersonProfileModalObj,
} from "../../modules/personProfileModal/reducer";
import { appConnect } from "../../store";
import { SlidePerson } from "../shared/SlidePerson";
import { ModalComponentBody } from "./ModalComponentBody";

import * as styles from "./PersonProfileModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  personProfileModalObj?: IPersonProfileModal;
}

interface IDispatchProps {
  onDismiss: () => void;
}

const PersonProfileModalComponent: React.SFC<IStateProps & IDispatchProps> = ({
  onDismiss,
  isOpen,
  personProfileModalObj,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onDismiss} centered>
      <ModalComponentBody onClose={onDismiss}>
        <SlidePerson
          description={(personProfileModalObj && personProfileModalObj.description) || ""}
          socialChannels={(personProfileModalObj && personProfileModalObj.socialChannels) || []}
          role={(personProfileModalObj && personProfileModalObj.role) || ""}
          name={(personProfileModalObj && personProfileModalObj.name) || ""}
          srcSet={{ "1x": (personProfileModalObj && personProfileModalObj.image) || "" }}
          layout="vertical"
        />
        <p className={styles.description}>
          {personProfileModalObj && personProfileModalObj.description}
        </p>
        {personProfileModalObj && (
          <div className={styles.linkWrapper}>
            <a href={personProfileModalObj.website} target="_blank">
              {personProfileModalObj.website}
            </a>
          </div>
        )}
      </ModalComponentBody>
    </Modal>
  );
};

export const PersonProfileModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isOpen: selectIsOpen(s.personProfileModal),
    personProfileModalObj: selectPersonProfileModalObj(s.personProfileModal),
  }),
  dispatchToProps: dispatch => ({
    onDismiss: () => dispatch(actions.personProfileModal.hidePersonProfileModal()),
  }),
})(PersonProfileModalComponent);
