import * as cn from "classnames";
import * as React from "react";

import { InlineIcon } from "../InlineIcon";
import { LoadingIndicator } from "../loading-indicator";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as closeIcon from "../../../assets/img/inline_icons/close.svg";
import { CommonHtmlProps } from "../../../types";

import * as styles from "./Button.module.scss";

type TButtonTheme = "dark" | "white" | "brand" | "silver" | "graphite";
type TIconPosition = "icon-before" | "icon-after";

export enum EButtonLayout {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  INLINE = "inline",
  SIMPLE = "simple",
}

export enum ButtonSize {
  NORMAL = "",
  SMALL = "small",
}

export enum ButtonWidth {
  NORMAL = "",
  WIDE = "wide",
  BLOCK = "block",
}

export enum ButtonTextPosition {
  CENTER = "",
  LEFT = "text-left",
  RIGHT = "text-right",
}

export interface IGeneralButton {
  onClick?: (event: any) => void;
}

interface IButtonIcon extends IGeneralButton {
  svgIcon: string;
  className?: string;
}

export interface IButtonProps extends IGeneralButton, CommonHtmlProps {
  layout?: EButtonLayout;
  theme?: TButtonTheme;
  disabled?: boolean;
  svgIcon?: string;
  type?: string;
  iconPosition?: TIconPosition;
  size?: ButtonSize;
  width?: ButtonWidth;
  isLoading?: boolean;
  textPosition?: ButtonTextPosition;
}

const buttonLayoutClassNames: Record<EButtonLayout, string> = {
  [EButtonLayout.PRIMARY]: styles.buttonPrimary,
  [EButtonLayout.SECONDARY]: styles.buttonSecondary,
  [EButtonLayout.INLINE]: styles.buttonInline,
  [EButtonLayout.SIMPLE]: styles.buttonSimple,
};

const Button: React.SFC<IButtonProps> = ({
  children,
  layout,
  theme,
  disabled,
  svgIcon,
  className,
  iconPosition,
  size,
  width,
  isLoading,
  type,
  textPosition,
  ...props
}) => (
  <button
    className={cn(
      styles.button,
      buttonLayoutClassNames[layout!],
      iconPosition,
      { [theme!]: layout !== EButtonLayout.INLINE },
      size,
      width,
    )}
    disabled={disabled || isLoading}
    type={type}
    {...props}
  >
    <div className={cn(styles.content, className, textPosition)} tabIndex={-1}>
      {isLoading ? (
        <LoadingIndicator light />
      ) : (
        <>
          {iconPosition === "icon-before" && <InlineIcon svgIcon={svgIcon || ""} />}
          {children}
          {iconPosition === "icon-after" && <InlineIcon svgIcon={svgIcon || ""} />}
        </>
      )}
    </div>
  </button>
);

Button.defaultProps = {
  layout: EButtonLayout.PRIMARY,
  theme: "dark",
  type: "button",
  disabled: false,
  size: ButtonSize.NORMAL,
  width: ButtonWidth.NORMAL,
};

const ButtonIcon: React.SFC<IButtonIcon> = ({ onClick, className, ...props }) => (
  <button className={cn(styles.buttonIcon, className)} onClick={onClick}>
    <InlineIcon {...props} width="20px" height="20px" />
  </button>
);

const ButtonClose: React.SFC<IGeneralButton> = props => (
  <ButtonIcon {...props} svgIcon={closeIcon} />
);

const ButtonArrowRight: React.SFC<IButtonProps> = props => (
  <Button
    {...props}
    layout={EButtonLayout.SECONDARY}
    iconPosition="icon-after"
    svgIcon={arrowRight}
  />
);

export { ButtonIcon, ButtonClose, ButtonArrowRight, Button };
