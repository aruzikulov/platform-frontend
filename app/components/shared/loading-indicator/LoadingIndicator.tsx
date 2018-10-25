import * as cn from "classnames";
import * as React from "react";

import * as styles from "./LoadingIndicator.module.scss";
import { LoadingIndicatorHexagon } from "./LoadingIndicatorHexagon";

type TLoadingIndicator = "pulse" | "blocks" | "hexagon";

interface ILoadingIndicatorProps {
  className?: string;
  light?: boolean;
  type?: TLoadingIndicator;
}

const LoadingIndicator: React.SFC<ILoadingIndicatorProps> = ({
  className,
  light,
  type = "pulse",
}) => {
  switch (type) {
    case "pulse":
      return <div className={cn(className, styles.spinner, { [styles.light]: light })} />;
    case "blocks":
      return (
        <div className={cn(className, styles.blocks)}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      );
    case "hexagon":
      return <LoadingIndicatorHexagon />;
  }
};

export { LoadingIndicator };
