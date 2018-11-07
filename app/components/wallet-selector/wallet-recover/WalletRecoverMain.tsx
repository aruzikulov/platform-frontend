import * as React from "react";
import { Col, Row } from "reactstrap";

import { LayoutRegisterLogin } from "../../layouts/LayoutRegisterLogin";
import { LayoutUnauthorized } from "../../layouts/LayoutUnauthorized";
import { RecoverRouter } from "./RecoverRouter";

export const WalletRecoverMain: React.SFC = () => (
  <LayoutUnauthorized>
    <LayoutRegisterLogin>
      <Row>
        <Col>
          <RecoverRouter />
        </Col>
      </Row>
    </LayoutRegisterLogin>
  </LayoutUnauthorized>
);
