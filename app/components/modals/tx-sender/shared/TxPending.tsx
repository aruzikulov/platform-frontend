import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETxSenderType } from "../../../../modules/tx/interfaces";
import { SpinningEthereum } from "../../../landing/parts/SpinningEthereum";
import { EtherscanTxLink } from "../../../shared/EtherscanLink";

import * as styles from "./TxPending.module.scss";

export interface ITxPendingProps {
  blockId: number;
  txHash: string;
  type: ETxSenderType;
}

export const TxPending: React.SFC<ITxPendingProps> = ({ blockId, txHash, type }) => (
  <div className="text-center" test-data-id="modals.shared.tx-pending.modal">
    <SpinningEthereum className="mb-3" />

    <h3 className={styles.title}>
      <FormattedMessage id="tx-sender.tx-pending.title" /> {type}
    </h3>

    <p>
      <FormattedMessage id="tx-sender.tx-pending.description" />
    </p>

    <EtherscanTxLink txHash={txHash} className={styles.txHash}>
      <FormattedMessage id="tx-sender.tx-pending.hash-label" /> {txHash}
    </EtherscanTxLink>

    <p>
      <FormattedMessage id="tx-sender.tx-pending.block-number-label" />
      <span className={styles.blockId}>{blockId}</span>
    </p>
  </div>
);
