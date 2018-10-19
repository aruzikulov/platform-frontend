import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../../types";

import * as styles from "./FormLabel.module.scss";

export const FormLabel: React.SFC<CommonHtmlProps> = ({ children, className }) => {
  return <div className={cn(styles.formLabel, className)}>{children}</div>;
};
