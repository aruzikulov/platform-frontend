import * as React from "react";
import { Col, Row } from "reactstrap";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { EtoList } from "./eto-list/EtoList";
import { EtoListDummies } from "./eto-list/EtoListDummies";
import { MyPortfolioWidget } from "./my-portfolio/MyPortfolioWidget";
import { MyWalletWidget } from "./my-wallet/MyWalletWidget";

export const Dashboard = () => (
  <LayoutAuthorized>
    <Row className="row-gutter-top" data-test-id="dashboard-application">
      <Col lg={8} xs={12}>
        <MyPortfolioWidget className="h-100" />
      </Col>

      <Col>
        <MyWalletWidget className="h-100" />
      </Col>

      {process.env.NF_EQUITY_TOKEN_OFFERINGS_VISIBLE === "1" &&
        (process.env.NF_ETO_LOAD_REAL_DATA ? <EtoList /> : <EtoListDummies />)}
    </Row>
  </LayoutAuthorized>
);
