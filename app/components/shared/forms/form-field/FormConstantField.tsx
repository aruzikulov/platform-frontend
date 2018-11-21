import * as cn from "classnames";
import * as React from "react";

import { TTranslatedString } from "../../../../types";

import * as styles from "./FormConstantField.module.scss";

interface IProps {
  value: string;
  className?: string;
  valid?: boolean;
  errorMessage?: TTranslatedString;
}

export const FormConstantField: React.SFC<IProps> = ({
  value,
  className,
  valid,
  errorMessage,
  ...props
}) => (
  <div className={cn(styles.valueWrapper, className)} {...props}>
    <span>{value}</span>
    {!valid && <div className={styles.error}>{errorMessage}</div>}
  </div>
);
