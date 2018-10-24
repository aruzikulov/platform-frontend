import * as React from "react";
import { ListGroup } from "reactstrap";

import * as styles from "./InfoList.module.scss";

export const InfoList: React.SFC = ({ children }) => (
  <ListGroup className={styles.infoList}>{children}</ListGroup>
);
