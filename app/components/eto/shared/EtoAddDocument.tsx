import * as React from "react";
import Dropzone from "react-dropzone";
import { compose } from "redux";

import { etoDocumentType } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import * as styles from "./EtoAddDocument.module.scss";

interface IDispatchProps {
  onDropFile: (file: File, documentType: etoDocumentType) => void;
}

interface IOwnProps {
  children: React.ReactNode;
  documentType: etoDocumentType;
  disabled?: boolean;
}
export const ETOAddDocumentsComponent: React.SFC<IDispatchProps & IOwnProps> = ({
  onDropFile,
  children,
  documentType,
  disabled,
}) => {
  const onDrop = (accepted: File[]) => accepted[0] && onDropFile(accepted[0], documentType);
  return (
    <Dropzone
      accept="application/pdf"
      onDrop={onDrop}
      activeClassName={styles.invisible}
      acceptClassName={styles.invisible}
      rejectClassName={styles.invisible}
      disabledClassName={styles.invisible}
      className={styles.invisible}
      disabled={disabled}
    >
      {children}
    </Dropzone>
  );
};

export const ETOAddDocuments = compose<React.SFC<IOwnProps>>(
  appConnect<{}, IDispatchProps, IOwnProps>({
    dispatchToProps: dispatch => ({
      onDropFile: (file: File, documentType: etoDocumentType) =>
        dispatch(
          actions.etoDocuments.showIpfsModal(() =>
            dispatch(actions.etoDocuments.etoUploadDocument(file, documentType)),
          ),
        ),
    }),
  }),
)(ETOAddDocumentsComponent);