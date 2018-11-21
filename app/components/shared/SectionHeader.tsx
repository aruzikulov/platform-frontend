import * as cn from "classnames";
import * as React from "react";

import { TTranslatedString } from "../../types";

import * as styles from "./SectionHeader.module.scss";

export enum ESectionHeaderSize {
  SMALL = styles.small,
}

interface IProps {
  className?: string;
  description?: TTranslatedString;
  layoutHasDecorator?: boolean;
  size?: ESectionHeaderSize;
}

export const SectionHeader: React.SFC<IProps> = ({
  children,
  className,
  layoutHasDecorator,
  description,
  size,
}) => (
  <header
    className={cn(styles.sectionHeader, size, className, {
      [styles.hasDecorator]: layoutHasDecorator,
    })}
  >
    <h3 className={cn(styles.header)}>{children}</h3>
    {description && <p className={cn(styles.description)}>{description}</p>}
  </header>
);

SectionHeader.defaultProps = {
  layoutHasDecorator: true,
};
