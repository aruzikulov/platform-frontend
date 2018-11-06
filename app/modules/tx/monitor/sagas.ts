import { delay } from "redux-saga";
import { put } from "redux-saga/effects";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { TPendingTxs } from "../../../lib/api/users/interfaces";
import { actions } from "../../actions";
import { neuCall, neuTakeUntil } from "../../sagasUtils";

const TX_MONITOR_DELAY = 60000;

async function getPendingTransactionsPromise({
  apiUserService,
}: TGlobalDependencies): Promise<TPendingTxs> {
  return apiUserService.pendingTxs();
}

async function cleanPendingTransactionsPromise(
  { web3Manager, apiUserService, logger }: TGlobalDependencies,
  apiPendingTx: TPendingTxs,
): Promise<TPendingTxs> {
  // if there's pending transaction then resolve it
  if (apiPendingTx.pendingTransaction) {
    const txHash = apiPendingTx.pendingTransaction.transaction.hash;
    logger.info("Resolving pending transaction with hash", txHash);
    const transactionReceipt = await web3Manager.internalWeb3Adapter.getTransactionReceipt(txHash);
    // transactionReceipt should be null if transaction is not mined
    if (transactionReceipt && transactionReceipt.blockNumber) {
      logger.info(`Resolved transaction ${txHash} at block ${transactionReceipt.blockNumber}`);
      await apiUserService.deletePendingTx(txHash);
      // it's resolved so remove
      apiPendingTx.pendingTransaction = undefined;
    }
  }
  return apiPendingTx;
}

export function* updateTxs(): any {
  let apiPendingTx = yield neuCall(getPendingTransactionsPromise);
  apiPendingTx = yield neuCall(cleanPendingTransactionsPromise, apiPendingTx);
  yield put(actions.txMonitor.loadTxs(apiPendingTx));
}

function* txMonitor({ logger, notificationCenter }: TGlobalDependencies): any {
  while (true) {
    logger.info("Querying for pending txs...");
    try {
      yield neuCall(updateTxs);
    } catch (e) {
      notificationCenter.error("Error while trying to get pending transactions");
      logger.error("Error getting pending txs", e);
    }

    yield delay(TX_MONITOR_DELAY);
  }
}

export function* txMonitorSagas(): any {
  yield neuTakeUntil("AUTH_LOAD_USER", "AUTH_LOGOUT", txMonitor);
}
