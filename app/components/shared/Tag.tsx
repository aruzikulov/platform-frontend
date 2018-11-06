import * as cn from "classnames";
import * as React from "react";
import { Link } from "react-router-dom";

import { TTranslatedString } from "../../types";

import { InlineIcon } from "./InlineIcon";

import * as styles from "./Tag.module.scss";

type TTheme = "dark" | "green" | "white" | "default" | "silver";
type TLayout = "ghost" | "ghost-bold" | "bold";
type TSize = "small";

export interface ITag {
  text: TTranslatedString;
  to?: string;
  layout?: TLayout;
  size?: TSize;
  theme?: TTheme;
  className?: string;
  onClick?: (e: any) => void;
  svgIcon?: string;
  placeSvgInEnd?: boolean;
  component?: React.ComponentType<any>;
  componentProps?: any;
  target?: string;
}

export const Tag: React.SFC<ITag> = ({
  text,
  to,
  layout,
  size,
  theme,
  className,
  onClick,
  svgIcon,
  placeSvgInEnd,
  component: Component,
  componentProps = {},
  target,
}) => {
  const classes = cn(styles.tag, layout, size, theme, className);
  const tagContent = (
    <>
      {!placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} />}
      {text}
      {placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} className="ml-2" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} target={target}>
        {tagContent}
      </Link>
    );
  }

  if (Component) {
    return (
      <Component className={classes} {...componentProps}>
        {tagContent}
      </Component>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={cn(classes, styles.tagAsButton)}>
        {tagContent}
      </button>
    );
  }

  return <span className={classes}>{tagContent}</span>;
};
