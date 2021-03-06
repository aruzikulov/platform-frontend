import * as React from "react";

import * as styles from "./SuccessTick.module.scss";

export const SuccessTick: React.SFC = () => (
  <div className={styles.sa}>
    <div className={styles.saSuccess}>
      <div className={styles.saSuccessTip} />
      <div className={styles.saSuccessLong} />
      <div className={styles.saSuccessPlaceholder} />
      <div className={styles.saSuccessFix} />
    </div>
  </div>
);
