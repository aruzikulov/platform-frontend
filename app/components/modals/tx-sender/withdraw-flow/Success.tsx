import * as React from "react";
import { ConfettiEthereum } from "../../../landing/parts/ConfettiEthereum";

import * as styles from "./Success.module.scss";

interface IProps {
  txHash: string;
}

export const WithdrawSuccess: React.SFC<IProps> = ({ txHash }) => (
  <div className="text-center" data-test-id="modals.tx-sender.withdraw-flow.success">
    <ConfettiEthereum className="mb-3" />
    <h3 className={styles.title}>Transaction confirmed</h3>
    <div data-test-id="modals.tx-sender.withdraw-flow.tx-hash">{txHash}</div>
  </div>
);
