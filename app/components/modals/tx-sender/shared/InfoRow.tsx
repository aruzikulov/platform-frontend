import * as React from "react";
import { ListGroupItem } from "reactstrap";

import * as styles from "./InfoRow.module.scss";

interface IInfoRowProps {
  caption: React.ReactNode;
  value: string | React.ReactNode;
}

export const InfoRow: React.SFC<IInfoRowProps> = ({ caption, value }) => (
  <ListGroupItem className={styles.infoRow}>
    <div className={styles.infoCell}>{caption}</div>
    <div className={styles.infoCell}>{value}</div>
  </ListGroupItem>
);
