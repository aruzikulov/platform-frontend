import * as cn from "classnames";
import * as React from "react";

import { InlineIcon } from "./InlineIcon";

import * as icon from "../../assets/img/inline_icons/icon_check.svg";
import { CommonHtmlProps } from "../../types";
import * as styles from "./VerificationStatus.module.scss";

export interface IVerificationProgressStep {
  label: string | React.ReactNode;
  isChecked: boolean;
  onClick?: () => void;
}

interface IProps {
  steps: IVerificationProgressStep[];
}

export const VerificationStatus: React.SFC<IProps & CommonHtmlProps> = ({ steps, ...props }) => {
  return (
    <div {...props} className={cn(styles.verificationStatus, props.className)}>
      {steps.map(({ label, isChecked, onClick }, index) => (
        <div className={styles.step} style={{ flexBasis: `${100 / steps.length}%` }} key={index}>
          <button
            className={cn(styles.indicator, isChecked && "is-checked")}
            onClick={onClick ? () => onClick() : () => {}}
          >
            {isChecked ? <InlineIcon svgIcon={icon} /> : index + 1}
          </button>
          <div className={styles.label}>{label}</div>
        </div>
      ))}
    </div>
  );
};
