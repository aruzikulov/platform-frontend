import * as cn from "classnames";
import * as React from "react";

import * as styles from "./Alerts.module.scss";

export const InfoAlert: React.SFC = ({ children }) => {
  return <div className={cn("alert", styles.alert)}>{children}</div>;
};
