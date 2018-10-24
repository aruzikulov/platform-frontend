import * as React from "react";
import { Col, Row } from "reactstrap";

import * as styles from "./LayoutShared.module.scss";

export const LayoutBase: React.SFC = ({ children }) => (
  <div className={`wrapper ${styles.layoutBg}`}>
    <div className="layout-container">
      <Row>
        <Col>{children}</Col>
      </Row>
    </div>
  </div>
);
