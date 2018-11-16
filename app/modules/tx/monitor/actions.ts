import { TPendingTxs } from "../../../lib/api/users/interfaces";
import { createAction } from "../../actionsUtils";

export const txMonitorActions = {
  setPendingTxs: (txs: TPendingTxs) => createAction("TX_MONITOR_LOAD_TXS", { txs }),
};
