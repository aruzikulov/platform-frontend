import * as cn from "classnames";
import * as React from "react";

import { TTranslatedString } from "../../types";
import { CopyToClipboard } from "./CopyToClipboard";
import { InlineIcon } from "./InlineIcon";

import * as iconDownload from "../../assets/img/inline_icons/download.svg";
import * as styles from "./HighlightedField.module.scss";

interface IProps {
  label: TTranslatedString;
  value: string | React.ReactNode;
  icon?: string;
  link?: {
    title: TTranslatedString;
    url: string;
  };
  withCopy?: boolean;
  dataTestId?: string;
}

export const HighlightedField: React.SFC<IProps> = ({
  label,
  value,
  icon,
  link,
  withCopy,
  dataTestId,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.highlightedHeader}>
        <div>
          {icon && <img className={styles.icon} src={icon} alt="icon" />}
          <span>{label}</span>
        </div>
        {link && (
          <div>
            <InlineIcon svgIcon={iconDownload} />
            <a href={link.url} download>
              {link.title}
            </a>
          </div>
        )}
      </div>
      <div
        className={cn(styles.highlightedField, withCopy && "d-flex justify-content-between")}
        data-test-id={dataTestId}
      >
        {withCopy && <CopyToClipboard value={value} />}
        {value}
      </div>
    </div>
  );
};
