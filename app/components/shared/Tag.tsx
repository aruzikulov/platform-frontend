import * as cn from "classnames";
import * as React from "react";
import { Link } from "react-router-dom";
import { InlineIcon } from "./InlineIcon";
import * as styles from "./Tag.module.scss";

type TTheme = "dark" | "green" | "white" | "default";
type TLayout = "ghost" | "ghost-bold";
type TSize = "small";

export interface ITag {
  text: string;
  to?: string;
  layout?: TLayout;
  size?: TSize;
  theme?: TTheme;
  className?: string;
  onClick?: (e: any) => void;
  svgIcon?: string;
  end?: boolean;
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
  end,
}) => {
  const classes = cn(styles.tag, layout, size, theme, className);

  return (
    <>
      {to ? (
        <Link to={to} className={classes}>
          {!end && !!svgIcon && <InlineIcon svgIcon={svgIcon} />}
          {text}
          {end && !!svgIcon && <InlineIcon svgIcon={svgIcon} />}
        </Link>
      ) : (
        <span onClick={onClick} className={classes}>
          {!end && !!svgIcon && <InlineIcon svgIcon={svgIcon} className="ml-2 mr-0"/>}
          {text}
          {end && !!svgIcon && <InlineIcon svgIcon={svgIcon} className="ml-2 mr-0"/>}
        </span>
      )}
    </>
  );
};
