import * as React from "react";
import { Col, Row } from "reactstrap";

import { DepositEthModal } from "../modals/DepositEthModal";
import { IcbmWalletBalanceModal } from "../modals/icbm-wallet-balance-modal/IcbmWalletBalanceModal";
import { BankTransferFlowModal } from "../modals/tx-sender/investment-flow/BankTransferFlow";
import { TxSenderModal } from "../modals/tx-sender/TxSender";
import { NotificationWidget } from "../shared/notification-widget/NotificationWidget";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { LayoutAuthorizedMenu } from "./LayoutAuthorizedMenu";

import * as styles from "./LayoutAuthorized.module.scss";
import * as sharedStyles from "./LayoutShared.module.scss";

export const LayoutAuthorized: React.SFC = ({ children }) => (
  <>
    <Header />

    <div className={`wrapper ${sharedStyles.layoutBg}`}>
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
