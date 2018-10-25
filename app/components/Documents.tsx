import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { EtoState, EtoStateToCamelcase } from "../lib/api/eto/EtoApi.interfaces";
import {
  EEtoDocumentType,
  IEtoDocument,
  IEtoFiles,
  TEtoDocumentTemplates,
} from "../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../modules/actions";
import {
  selectEtoDocumentData,
  selectEtoDocumentLoading,
} from "../modules/eto-documents/selectors";
import {
  selectEtoLoading,
  selectIssuerEtoState,
  selectIssuerEtoTemplates,
} from "../modules/eto-flow/selectors";
import { appConnect } from "../store";
import { DeepPartial } from "../types";
import { onEnterAction } from "../utils/OnEnterAction";
import { ETOAddDocuments } from "./eto/shared/EtoAddDocument";
import { EtoFileIpfsModal } from "./eto/shared/EtoFileIpfsModal";
import { LayoutAuthorized } from "./layouts/LayoutAuthorized";
import { ClickableDocumentTile, DocumentTile } from "./shared/Document";
import { LoadingIndicator } from "./shared/loading-indicator";
import { SectionHeader } from "./shared/SectionHeader";
import { SingleColDocuments } from "./shared/SingleColDocumentWidget";

import { setDisplayName } from "recompose";
import * as styles from "./Documents.module.scss";

type IProps = IStateProps & IDispatchProps;

interface IStateProps {
  etoFilesData: IEtoFiles;
  loadingData: boolean;
  etoFileLoading: boolean;
  etoState?: EtoState;
  etoLinks?: DeepPartial<TEtoDocumentTemplates>;
}

interface IDispatchProps {
  generateTemplate: (document: IEtoDocument) => void;
  downloadDocumentByType: (documentType: EEtoDocumentType) => void;
}

export const documentTitles: { [key in EEtoDocumentType]: string | React.ReactNode } = {
  company_token_holder_agreement: (
    <FormattedMessage id="eto.documents.company-token-holder-agreement" />
  ),
  investment_and_shareholder_agreement: (
    <FormattedMessage id="eto.documents.investment-and-shareholder-agreement" />
  ),
  pamphlet_template: <FormattedMessage id="eto.documents.pamphlet_template" />,
  prospectus_template: <FormattedMessage id="eto.documents.prospectus-Template" />,
  reservation_and_acquisition_agreement: (
    <FormattedMessage id="eto.documents.reservation-and-acquisition-agreement" />
  ),
  termsheet_template: <FormattedMessage id="eto.documents.Termsheet-Template" />,
  approved_prospectus: <FormattedMessage id="eto.documents.Approved-Prospectus" />,
  approved_pamphlet: <FormattedMessage id="eto.documents.Approved-Pamphlet" />,
  signed_investment_and_shareholder_agreement: (
    <FormattedMessage id="eto.documents.investment-and-shareholder-agreement" />
  ),
  other: <FormattedMessage id="eto.documents.other" />,
};

// Documents to not be presented
const ignoredDocuments: string[] = ["pamphletTemplate", "termsheetTemplate", "prospectusTemplate"];

export const GeneratedDocuments: React.SFC<{
  document: IEtoDocument;
  generateTemplate: (document: IEtoDocument) => void;
}> = ({ document, generateTemplate }) => {
  return (
    <Col xs={6} lg={3} key={"url"} className="mb-4">
      <ClickableDocumentTile
        document={document}
        generateTemplate={generateTemplate}
        title={documentTitles[document.documentType]}
        extension={".doc"}
      />
    </Col>
  );
};

export const DocumentsComponent: React.SFC<IProps> = ({
  loadingData,
  etoFilesData,
  generateTemplate,
  etoFileLoading,
  etoState,
  etoLinks,
  downloadDocumentByType,
}) => {
  const { etoTemplates, uploadedDocuments, stateInfo } = etoFilesData;
  const generalUploadables = stateInfo ? stateInfo.uploadableDocuments : [];
  return (
    <LayoutAuthorized>
      {loadingData || etoFileLoading || !etoState ? (
        <LoadingIndicator />
      ) : (
        <Row>
          <EtoFileIpfsModal />
          <Col xs={12} lg={8}>
            <SectionHeader className="my-4">
              <FormattedMessage id="documents.legal-documents" />
            </SectionHeader>

            <Row>
              <Col xs={12} className={styles.groupName}>
                <FormattedMessage id="documents.generated-documents" />
              </Col>
              {Object.keys(etoTemplates)
                .filter(key => !ignoredDocuments.some(ignoredDocument => ignoredDocument === key))
                .map((key, index) => {
                  return (
                    <GeneratedDocuments
                      key={index}
                      document={etoTemplates[key]}
                      generateTemplate={generateTemplate}
                    />
                  );
                })}
              {Object.keys(etoTemplates).length === 0 && (
                <Col className="mb-2">
                  <div>
                    <FormattedMessage id="documents.please-fill-the-eto-forms-in-order-to-generate-templates" />
                  </div>
                </Col>
              )}
            </Row>

            <Row>
              <Col xs={12} className={styles.groupName}>
                <FormattedMessage id="documents.approved-prospectus-and-agreements-to-upload" />
              </Col>
              {generalUploadables.map((key: EEtoDocumentType, index: number) => {
                const typedFileName = documentTitles[key];
                const canUpload =
                  stateInfo &&
                  stateInfo.canUploadInStates[EtoStateToCamelcase[etoState]].some(
                    fileName => fileName === key,
                  );
                const isFileUploaded = Object.keys(uploadedDocuments).some(
                  uploadedKey => uploadedDocuments[uploadedKey].documentType === key,
                );
                return (
                  <Col xs={6} lg={3} key={index} className="mb-2">
                    <ETOAddDocuments documentType={key} disabled={!canUpload}>
                      <DocumentTile
                        title={typedFileName}
                        extension={".pdf"}
                        active={canUpload}
                        blank={!isFileUploaded}
                      />
                    </ETOAddDocuments>
                    {isFileUploaded && (
                      <button
                        onClick={() => downloadDocumentByType(key)}
                        className={cn(styles.subTitleDownload)}
                      >
                        <FormattedMessage id="documents.download-document" />
                      </button>
                    )}
                  </Col>
                );
              })}
            </Row>
          </Col>
          <Col xs={12} lg={4}>
            <SectionHeader className="my-4" layoutHasDecorator={false} />
            <Row>
              {etoLinks && (
                <SingleColDocuments
                  documents={Object.keys(etoLinks).map(key => {
                    return etoLinks[key] as IEtoDocument;
                  })}
                  title={<FormattedMessage id="documents.agreement-and-prospectus-templates" />}
                  className={styles.documents}
                />
              )}
            </Row>
          </Col>
        </Row>
      )}
    </LayoutAuthorized>
  );
};

export const Documents = compose<React.SFC>(
  setDisplayName("Documents"),
  onEnterAction({ actionCreator: d => d(actions.etoDocuments.loadFileDataStart()) }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      etoFilesData: selectEtoDocumentData(state.etoDocuments),
      loadingData: selectEtoLoading(state.etoFlow),
      etoFileLoading: selectEtoDocumentLoading(state.etoDocuments),
      etoState: selectIssuerEtoState(state),
      etoLinks: selectIssuerEtoTemplates(state),
    }),
    dispatchToProps: dispatch => ({
      generateTemplate: document => dispatch(actions.etoDocuments.generateTemplate(document)),
      downloadDocumentByType: documentType =>
        dispatch(actions.etoDocuments.downloadDocumentByType(documentType)),
    }),
  }),
)(DocumentsComponent);
