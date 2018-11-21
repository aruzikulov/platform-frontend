import * as cn from "classnames";
import * as React from "react";

import * as styles from "./WarningAlert.module.scss";

interface IWarningAlertProps {
  className?: string;
}

export const WarningAlert: React.SFC<IWarningAlertProps> = ({ children, className }) => (
  <div className={cn(styles.warningAlert, className)}>
    <span>
      <i className={cn("fa fa-exclamation-circle mr-2", styles.icon)} aria-hidden="true" />
      {children}
    </span>
  </div>
);
