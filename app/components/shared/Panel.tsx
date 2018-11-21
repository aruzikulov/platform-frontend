import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TTranslatedString } from "../../types";

import * as styles from "./Panel.module.scss";

export interface IPanelProps extends CommonHtmlProps {
  headerText?: TTranslatedString;
  rightComponent?: React.ReactNode;
  icon?: string;
  narrow?: boolean;
}

const Panel: React.SFC<IPanelProps> = ({
  headerText,
  rightComponent,
  icon,
  className,
  children,
  narrow,
  ...props
}) => {
  const hasHeader = !!(headerText || rightComponent || icon);

  return (
    <div {...props} className={cn(styles.panel, className, { [styles.narrow]: narrow })}>
      {hasHeader && (
        <header className={cn(styles.header, { [styles.hasIcon]: !!(icon || !headerText) })}>
          {icon && <img src={icon} className={styles.icon} />}
          {headerText && <div className={styles.left}>{headerText}</div>}
          {rightComponent && <div className={styles.right}>{rightComponent}</div>}
        </header>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export { Panel };
