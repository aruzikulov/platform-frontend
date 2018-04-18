import * as cn from "classnames";
import * as React from "react";
import * as styles from "./InlineIcon.module.scss";

interface IProps {
  svgIcon: string;
  width?: string;
  height?: string;
  onClick?: () => void;
}

export const InlineIcon: React.SFC<IProps> = ({ svgIcon, width, height, ...props }) => {
  return (
    <span
      className={cn("inline-icon", styles.inlineIcon)}
      style={{ width, height }}
      dangerouslySetInnerHTML={{ __html: svgIcon }}
      {...props}
    />
  );
};
