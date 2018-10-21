import * as React from "react";
import { Col, Row } from "reactstrap";

import { NotificationWidget } from "../dashboard/notification-widget/NotificationWidget";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { DepositEthModal } from "../modals/DepositEthModal";
import { IcbmWalletBalanceModal } from "../modals/IcbmWalletBalanceModal";
import { TxSenderModal } from "../modals/tx-sender/TxSender";
import { LayoutAuthorizedMenu } from "./LayoutAuthorizedMenu";

import { BankTransferFlowModal } from "../modals/tx-sender/investment-flow/BankTransferFlow";
import * as styles from "./LayoutAuthorized.module.scss";

export const LayoutAuthorized: React.SFC = ({ children }) => (
  <>
    <Header />

    <div className="wrapper">
      <div>
        <LayoutAuthorizedMenu />
      </div>
      <div className="layout-container">
        <NotificationWidget />
        <Row>
          <Col className={styles.content}>{children}</Col>
        </Row>
      </div>
    </div>

    <Footer />

    <DepositEthModal />
    <TxSenderModal />
    <IcbmWalletBalanceModal />
    <BankTransferFlowModal />
  </>
);
