import * as React from "react";

import { TTranslatedString } from "../../../types";
import * as styles from "./FormHighlightGroup.module.scss";

interface IProps {
  title?: TTranslatedString | string;
}

export const FormHighlightGroup: React.SFC<IProps> = ({ title, children }) => {
  return (
    <div className={styles.formHighlightGroup}>
      {title && <div className="mb-4 text-uppercase">{title}</div>}
      {children}
    </div>
  );
};
