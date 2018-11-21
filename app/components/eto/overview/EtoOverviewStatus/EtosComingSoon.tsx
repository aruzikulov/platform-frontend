import * as cn from "classnames";
import * as React from "react";

import * as statusWidgetStyles from "./EtoOverviewStatus.module.scss";
import * as styles from "./EtosComingSoon.module.scss";

export const EtosComingSoon: React.SFC = () => (
  <p className={cn(statusWidgetStyles.etoOverviewStatus, styles.etosComingSoon)}>
    FURTHER investment opportunities coming soon!
  </p>
);
