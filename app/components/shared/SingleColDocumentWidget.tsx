import * as React from "react";
import { Col } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { IEtoDocument, immutableDocumentName } from "../../lib/api/eto/EtoFileApi.interfaces";
import { ImmutableFileId } from "../../lib/api/ImmutableStorage.interfaces";
import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { TTranslatedString } from "../../types";
import { documentTitles } from "../Documents";
import { DocumentTemplateButton } from "./DocumentLink";
import { InlineIcon } from "./InlineIcon";
import { Panel } from "./Panel";

import * as link from "../../assets/img/inline_icons/social_link.svg";
import * as styles from "./SingleColDocumentWidget.module.scss";

interface IOwnProps {
  documents: IEtoDocument[];
  title: TTranslatedString;
  className?: string;
}
interface IDispatchProps {
  downloadImmutableFile: (fileId: ImmutableFileId, fileName: string) => void;
}

type IProps = IOwnProps & IDispatchProps;

const SingleColDocumentsLayout: React.SFC<IProps> = ({
  documents,
  className,
  title,
  downloadImmutableFile,
}) => {
  return (
    <Panel className={className}>
      <Col className={styles.groupName}>{title}</Col>
      <div className={styles.group}>
        {documents.map(({ ipfsHash, mimeType, documentType }, i) => {
          return (
            <Col xs={12} className={styles.document} key={i}>
              <DocumentTemplateButton
                onClick={() =>
                  downloadImmutableFile(
                    {
                      ...{ ipfsHash, mimeType },
                      asPdf: false,
                    },
                    immutableDocumentName[documentType],
                  )
                }
                title={documentTitles[documentType]}
                altIcon={<InlineIcon svgIcon={link} />}
              />
            </Col>
          );
        })}
      </div>
    </Panel>
  );
};

const SingleColDocuments = compose<React.SFC<IOwnProps>>(
  setDisplayName("SingleColDocuments"),
  appConnect<{}, IDispatchProps>({
    dispatchToProps: dispatch => ({
      downloadImmutableFile: (fileId, name) =>
        dispatch(actions.immutableStorage.downloadImmutableFile(fileId, name)),
    }),
  }),
)(SingleColDocumentsLayout);

export { SingleColDocuments, SingleColDocumentsLayout };
