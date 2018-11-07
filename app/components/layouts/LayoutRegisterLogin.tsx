import * as cn from "classnames";
import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import * as styles from "./LayoutRegisterLogin.module.scss";

const LayoutRegisterLogin: React.SFC = ({ children }) => (
  <Container>
    <Row>
      <Col
        lg="12"
        xl={{ size: 10, offset: 1 }}
        className={cn("p-4", styles.mainContainer)}
        data-test-id="register-layout"
      >
        {children}
      </Col>
    </Row>
  </Container>
);

export { LayoutRegisterLogin };
