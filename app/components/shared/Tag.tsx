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
}) => {
  const classes = cn(styles.tag, layout, size, theme, className);

  if (to) {
    return (
      <Link to={to} className={classes}>
        {!placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} />}
        {text}
        {placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} className="ml-2" />}
      </Link>
    );
  }

  if (Component) {
    return (
      <Component className={classes} {...componentProps}>
        {!placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} />}
        {text}
        {placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} className="ml-2" />}
      </Component>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={cn(classes, styles.tagAsButton)}>
        {!placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} />}
        {text}
        {placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} className="ml-2" />}
      </button>
    );
  }

  return (
    <span className={classes}>
      {!placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} />}
      {text}
      {placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} className="ml-2" />}
    </span>
  );
};
