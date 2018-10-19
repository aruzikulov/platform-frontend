import * as cn from "classnames";
import * as React from "react";
import Dropzone from "react-dropzone";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { IKycFileInfo, TKycRequestType } from "../../lib/api/KycApi.interfaces";

import { InlineIcon } from "./InlineIcon";
import { ResponsiveImage } from "./ResponsiveImage";
import { UploadedFiles } from "./UploadedFiles";

import { TAcceptedFileType, TTranslatedString } from "../../types";

import * as bankStatementTemplate from "../../assets/img/bank-statement-template.svg";
import * as documentBothSidesImage from "../../assets/img/document-both-side.jpg";
import * as documentBothSidesImage2x from "../../assets/img/document-both-side@2x.jpg";
import * as documentBothSidesImage3x from "../../assets/img/document-both-side@3x.jpg";
import * as documentFrontImage from "../../assets/img/document-front.jpg";
import * as documentFrontImage2x from "../../assets/img/document-front@2x.jpg";
import * as documentFrontImage3x from "../../assets/img/document-front@3x.jpg";
import * as addFileIcon from "../../assets/img/inline_icons/add_file.svg";
import * as styles from "./MultiFileUpload.module.scss";

interface IProps {
  uploadType: TKycRequestType | TKycRequestType[];
  acceptedFiles: TAcceptedFileType;
  fileUploading: boolean;
  onDropFile: (file: File) => void;
  layout?: "horizontal" | "vertical";
  files?: IKycFileInfo[];
  requirements?: TTranslatedString[];
  "data-test-id"?: string;
}

export const individualRequirements = [
  <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.colored-photo" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.full-name" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.date-of-birth" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.valid-expiration-date" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.official-document-number" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.high-quality" />,
];

export const businessRequirements = [
  <FormattedMessage id="shared-component.multi-file-upload.requirements.business.proof-of-address" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.business.article-of-association" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.business.commercial-register-entry" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.business.partnership-agreement" />,
];

export const addressRequirements = [
  <FormattedMessage id="shared-component.multi-file-upload.requirements.address.full-name" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.address.current-address" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.address.date" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.address.issuing-company" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.address.high-quality" />,
];

const MultiFileUploadComponent: React.SFC<IProps> = ({
  acceptedFiles,
  fileUploading,
  requirements,
  files,
  layout,
  onDropFile,
  "data-test-id": dataTestId,
  ...props
}) => {
  const onDrop = (accepted: File[]) => accepted[0] && onDropFile(accepted[0]);

  const dropzoneInner = fileUploading ? (
    <FormattedMessage id="shared-component.multi-file-upload.uploading" />
  ) : (
    <FormattedHTMLMessage tagName="span" id="shared-component.multi-file-upload.upload-cta" />
  );

  const dropzoneWithFilesInner = (
    <FormattedMessage id="shared-component.multi-file-upload.add-more" />
  );

  return (
    <div className={cn(styles.multiFileUpload, layout)} data-test-id={dataTestId}>
      <Dropzone
        data-test-id="multi-file-upload-dropzone"
        accept={acceptedFiles}
        onDrop={onDrop}
        disabled={fileUploading}
        className={styles.dropzone}
        {...props}
      >
        <InlineIcon svgIcon={addFileIcon} />
        {files && files.length ? dropzoneWithFilesInner : dropzoneInner}
      </Dropzone>

      {files && files.length > 0 ? (
        <UploadedFiles files={files} />
      ) : (
        requirements && (
          <div className={styles.requirements}>
            <p className={styles.requirementsTitle}>
              <FormattedMessage id="shared-component.multi-file-upload.requirements.title" />
            </p>
            <ul>
              {requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
};

MultiFileUploadComponent.defaultProps = {
  layout: "horizontal",
};

export const MultiFileUpload: React.SFC<IProps> = ({
  fileUploading,
  files,
  onDropFile,
  uploadType,
  layout,
  "data-test-id": dataTestId,
}) => {
  const isIndividual = uploadType === "individual";
  const computedRequirements = isIndividual ? individualRequirements : businessRequirements;

  return (
    <div className={styles.upload}>
      {isIndividual && (
        <div className={styles.uploadInformationsWrapper}>
          <h3 className={styles.title}>
            Option 1 - If ID card has proof of address you only need to upload this document{" "}
          </h3>
          <h4 className={cn(styles.hint, "mb-3")}>*Coloured copy of both sides</h4>
          <ResponsiveImage
            srcSet={{
              "1x": documentBothSidesImage,
              "2x": documentBothSidesImage2x,
              "3x": documentBothSidesImage3x,
            }}
            alt="ID"
            width={344}
            height={111}
          />
          <h3 className={cn(styles.title, "my-4")}>
            Option 2 - Upload ID card / Passport + Utility bill / Bank statement{" "}
          </h3>
          <div className={styles.imagesWrapper}>
            <div className={styles.bankStatementWrapper}>
              <img src={bankStatementTemplate} alt="bank statement" />
            </div>
            <div className={styles.idWrapper}>
              <ResponsiveImage
                srcSet={{
                  "1x": documentFrontImage,
                  "2x": documentFrontImage2x,
                  "3x": documentFrontImage3x,
                }}
                alt="ID"
                width={133}
                height={94}
              />
            </div>
          </div>
        </div>
      )}
      <MultiFileUploadComponent
        requirements={computedRequirements}
        acceptedFiles="image/*,application/pdf"
        onDropFile={onDropFile}
        files={files}
        fileUploading={fileUploading}
        uploadType={uploadType}
        layout={layout}
        data-test-id={dataTestId}
      />
    </div>
  );
};
