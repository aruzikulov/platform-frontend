import * as cn from "classnames";
import * as React from "react";
import { IKycFileInfo } from "../../lib/api/KycApi.interfaces";
import * as styles from "./UploadedFiles.module.scss";

import * as confirmIcon from "../../assets/img/notifications/Success_small.svg";

interface IProps {
  files: IKycFileInfo[];
}

export const UploadedFiles: React.SFC<IProps> = ({ files }) => (
  <div className={cn("c-uploaded-files", styles.uploadedFiles)}>
    {files.map(({ fileName }, index) => (
      <div data-test-id={`multi-file-upload-file-${fileName}`} key={index} className={styles.file}>
        <span className={styles.text} title={fileName}>
          {fileName}
        </span>
        <img src={confirmIcon} className={styles.icon} />
      </div>
    ))}
  </div>
);
