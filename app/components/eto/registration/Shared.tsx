import * as cn from "classnames";
import * as React from "react";
import { HorizontalLine } from "../../shared/HorizontalLine";
import * as styles from "./Shared.module.scss";

interface ISectionProps {
  line?: boolean;
  className?: string;
}

export const Section: React.SFC<ISectionProps> = ({ line, className, children }) => (
  <>
    <div className={cn(styles.section, className)}>{children}</div>
    {line && <HorizontalLine className="mb-5" />}
  </>
);
