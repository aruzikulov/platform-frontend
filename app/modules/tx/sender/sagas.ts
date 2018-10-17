import { BigNumber } from "bignumber.js";
import { addHexPrefix } from "ethereumjs-util";
import { END, eventChannel } from "redux-saga";
import { call, fork, put, race, select, take } from "redux-saga/effects";
import * as Web3 from "web3";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { TPendingTxs, TxWithMetadata } from "../../../lib/api/users/interfaces";
import {
  InvalidChangeIdError,
  InvalidRlpDataError,
  LongTransactionQueError,
  LowNonceError,
  NotEnoughFundsError,
  RevertedTransactionError,
  UnknownEthNodeError,
} from "../../../lib/web3/Web3Adapter";
import { IAppState } from "../../../store";
import { multiplyBigNumbers } from "../../../utils/BigNumberUtils";
import { delay } from "../../../utils/delay";
import { connectWallet } from "../../access-wallet/sagas";
import { actions, TAction } from "../../actions";
import { onInvestmentTxModalHide } from "../../investment-flow/sagas";
import { neuCall, neuTakeEvery } from "../../sagas";
import { updateTxs } from "../monitor/sagas";
import { generateInvestmentTransaction } from "../transactionsGenerators/investment/sagas";
import {
  generateEtherUpgradeTransaction,
  generateEuroUpgradeTransaction,
} from "../transactionsGenerators/upgrade/sagas";
import { generateEthWithdrawTransaction } from "../transactionsGenerators/withdraw/sagas";
import { OutOfGasError } from "./../../../lib/web3/Web3Adapter";
import { ITxData } from "./../../../lib/web3/Web3Manager";
import { ETokenType, ETxSenderType } from "./reducer";
import { selectTxDetails, selectTxType } from "./selectors";

export function* withdrawSaga({ logger }: TGlobalDependencies): any {
  try {
    yield txSendSaga(ETxSenderType.WITHDRAW, generateEthWithdrawTransaction, true);

    logger.info("Withdrawing successful");
  } catch (e) {
    logger.warn("Withdrawing cancelled", e);
  }
}

export function* upgradeSaga({ logger }: TGlobalDependencies, action: TAction): any {
  try {
    if (action.type !== "TX_SENDER_START_UPGRADE") return;
    if (action.payload === ETokenType.EURO) {
      yield txSendSaga(ETxSenderType.UPGRADE, generateEuroUpgradeTransaction, false);
    } else {
      yield txSendSaga(ETxSenderType.UPGRADE, generateEtherUpgradeTransaction, false);
    }

    logger.info("Withdrawing successful");
  } catch (e) {
    logger.error("Upgrade Saga Error", e);
    return yield put(actions.txSender.txSenderError("Error while generating Transaction"));
  }
}

export function* investSaga({ logger }: TGlobalDependencies): any {
  try {
    yield txSendSaga(
      ETxSenderType.INVEST,
      generateInvestmentTransaction,
      true,
      onInvestmentTxModalHide,
    );
    logger.info("Investment successful");
  } catch (e) {
    logger.warn("Investment cancelled", e);
  }
}

export function* txSendSaga(
  type: ETxSenderType,
  transactionGenerationFunction: any,
  requiresUserInput: boolean,
  cleanupFunction?: any,
): any {
  const { result, cancel } = yield race({
    result: txSendProcess(type, transactionGenerationFunction, requiresUserInput),
    cancel: take("TX_SENDER_HIDE_MODAL"),
  });

  if (cancel) {
    if (cleanupFunction) yield cleanupFunction();
    throw new Error("TX_SENDING_CANCELLED");
  }

  // we need to wait for modal to close anyway
  yield take("TX_SENDER_HIDE_MODAL");
  yield put(actions.wallet.loadWalletData());

  return result;
}

export function* txSendProcess(
  TransactionType: ETxSenderType,
  transactionGenerationFunction: any,
  requiresUserInput: boolean,
): any {
  try {
    yield put(actions.gas.gasApiEnsureLoading());
    yield put(actions.txSender.txSenderShowModal(TransactionType));

    yield neuCall(ensureNoPendingTx, TransactionType);

    let txDetails;
    if (requiresUserInput) {
      yield put(actions.txSender.txSenderWatchPendingTxsDone(TransactionType));
      txDetails = yield take("TX_SENDER_ACCEPT_DRAFT");
    }

    yield neuCall(transactionGenerationFunction, txDetails);

    yield take("TX_SENDER_ACCEPT");

    yield call(connectWallet, "Send funds!");
    yield put(actions.txSender.txSenderWalletPlugged());
    const txHash = yield neuCall(sendTxSubSaga);

    yield neuCall(watchTxSubSaga, txHash);
  } catch (error) {
    if (error instanceof OutOfGasError) {
      return yield put(actions.txSender.txSenderError("Gas too low"));
    } else if (error instanceof LowNonceError) {
      return yield put(actions.txSender.txSenderError("Nonce too low"));
    } else if (error instanceof LongTransactionQueError) {
      return yield put(actions.txSender.txSenderError("Too many transactions in que"));
    } else if (error instanceof InvalidRlpDataError) {
      return yield put(actions.txSender.txSenderError("Invalid RLP transaction"));
    } else if (error instanceof InvalidChangeIdError) {
      return yield put(actions.txSender.txSenderError("Invalid chain id"));
    } else if (error instanceof UnknownEthNodeError) {
      return yield put(actions.txSender.txSenderError("Tx was rejected"));
    }
  }
}

function* ensureNoPendingTx({ logger }: TGlobalDependencies, type: ETxSenderType): any {
  while (true) {
    yield neuCall(updateTxs);
    let txs: TPendingTxs = yield select((s: IAppState) => s.txMonitor.txs);
    if (!txs.pendingTransaction && txs.oooTransactions.length === 0) {
      yield put(actions.txSender.txSenderWatchPendingTxsDone(type));
      return;
    }

    if (txs.pendingTransaction) {
      const txHash = txs.pendingTransaction.transaction.hash;
      // go to miner
      yield put(
        actions.txSender.txSenderSigned(txHash, txs.pendingTransaction
          .transactionType as ETxSenderType),
      );
      yield neuCall(watchTxSubSaga, txHash);
      return;
    }

    yield put(actions.txSender.txSenderWatchPendingTxs());

    // here we can just wait
    logger.info(`Waiting for out of bound transactions: ${txs.oooTransactions.length}`);
    yield delay(3000);
  }
}

function* sendTxSubSaga({ web3Manager, apiUserService }: TGlobalDependencies): any {
  const txData: ITxData = yield select((s: IAppState) => selectTxDetails(s.txSender));
  const type = yield select((s: IAppState) => selectTxType(s.txSender));
  if (!txData) {
    throw new Error("Tx data is not defined");
  }
  try {
    const userBalance: BigNumber = yield web3Manager.getBalance(txData.from);
    if (userBalance.comparedTo(multiplyBigNumbers([txData.gasPrice, txData.gas])) < 0)
      throw new NotEnoughFundsError();

    const txHash: string = yield web3Manager.sendTransaction(txData);
    yield put(actions.txSender.txSenderSigned(txHash, type));
    const txWithMetadata: TxWithMetadata = {
      transaction: {
        from: addHexPrefix(txData.from),
        gas: addHexPrefix(new BigNumber(txData.gas).toString(16)),
        gasPrice: addHexPrefix(new BigNumber(txData.gasPrice).toString(16)),
        hash: addHexPrefix(txHash),
        input: addHexPrefix(txData.data || "0x0"),
        nonce: addHexPrefix("0"),
        to: addHexPrefix(txData.to),
        value: addHexPrefix(new BigNumber(txData.value).toString(16)),
        blockHash: undefined,
        blockNumber: undefined,
        chainId: undefined,
        status: undefined,
        transactionIndex: undefined,
      },
      transactionType: type,
    };
    yield apiUserService.addPendingTx(txWithMetadata);
    yield neuCall(updateTxs);

    return txHash;
  } catch (error) {
    // @see https://github.com/paritytech/parity-ethereum/blob/61f4534e2a5f9c947661af0eaf4af5b76456efe0/rpc/src/v1/helpers/errors.rs#L304
    if (
      error.code === -32010 &&
      error.message.startsWith("Insufficient funds. The account you tried to send transaction")
    ) {
      return yield put(actions.txSender.txSenderError("Not enough funds"));
    }
    if (
      (error.code === -32000 && error.message === "intrinsic gas too low") ||
      (error.code === -32010 &&
        error.message.startsWith("Transaction gas is too low. There is not enough")) ||
      (error.code === -32010 && error.message.startsWith("exceeds current gas limit"))
    ) {
      throw new OutOfGasError();
    }

    if (error.code === -32010 && error.message.startsWith("Transaction nonce is too low")) {
      throw new LowNonceError();
    }
    if (
      error.code === -32010 &&
      error.message.startsWith("There are too many transactions in the queue")
    ) {
      throw new LongTransactionQueError();
    }
    if (error.code === -32010 && error.message.startsWith("Invalid RLP data")) {
      throw new InvalidRlpDataError();
    }
    if (error.code === -32010 && error.message.startsWith("Invalid chain id")) {
      throw new InvalidChangeIdError();
    }
  }
  throw new UnknownEthNodeError();
}

function* watchTxSubSaga({ logger }: TGlobalDependencies, txHash: string): any {
  const watchTxChannel = yield neuCall(createWatchTxChannel, txHash);
  try {
    while (true) {
      const result: TEventEmitterChannelEvents = yield take(watchTxChannel);
      switch (result.type) {
        case EventEmitterChannelEvents.NEW_BLOCK:
          yield put(actions.txSender.txSenderReportBlock(result.blockId));
          break;
        case EventEmitterChannelEvents.TX_MINED:
          return yield put(actions.txSender.txSenderTxMined());
        case EventEmitterChannelEvents.ERROR:
          logger.error("Error while tx watching: ", result.error);
          return yield put(actions.txSender.txSenderError("Error while watching tx."));
        case EventEmitterChannelEvents.OUT_OF_GAS:
          logger.error("Error Transaction Reverted: ", result.error);
          return yield put(actions.txSender.txSenderError("Out of gas"));
        case EventEmitterChannelEvents.REVERTED_TRANSACTION:
          logger.error("Error Transaction Reverted: ", result.error);
          return yield put(actions.txSender.txSenderError("Reverted Transaction"));
      }
    }
  } finally {
    watchTxChannel.close();
    logger.info("Stopped Watching for TXs");
  }
}

enum EventEmitterChannelEvents {
  NEW_BLOCK = "NEW_BLOCK",
  TX_MINED = "TX_MINED",
  ERROR = "ERROR",
  REVERTED_TRANSACTION = "REVERTED_TRANSACTION",
  OUT_OF_GAS = "OUT_OF_GAS",
}
type TEventEmitterChannelEvents =
  | {
      type: EventEmitterChannelEvents.NEW_BLOCK;
      blockId: number;
    }
  | {
      type: EventEmitterChannelEvents.TX_MINED;
      tx: Web3.Transaction;
    }
  | {
      type: EventEmitterChannelEvents.ERROR;
      error: any;
    }
  | {
      type: EventEmitterChannelEvents.REVERTED_TRANSACTION;
      error: any;
    }
  | {
      type: EventEmitterChannelEvents.OUT_OF_GAS;
      error: any;
    };

const createWatchTxChannel = ({ web3Manager }: TGlobalDependencies, txHash: string) =>
  eventChannel<TEventEmitterChannelEvents>(emitter => {
    web3Manager.internalWeb3Adapter
      .waitForTx({
        txHash,
        onNewBlock: async blockId => {
          emitter({ type: EventEmitterChannelEvents.NEW_BLOCK, blockId });
        },
      })
      .then(tx => emitter({ type: EventEmitterChannelEvents.TX_MINED, tx }))
      .catch(error => {
        if (error instanceof RevertedTransactionError) {
          emitter({ type: EventEmitterChannelEvents.REVERTED_TRANSACTION, error });
        } else if (error instanceof OutOfGasError) {
          emitter({ type: EventEmitterChannelEvents.OUT_OF_GAS, error });
        } else {
          emitter({ type: EventEmitterChannelEvents.ERROR, error });
        }
      })
      .then(() => emitter(END));
    return () => {
      // @todo missing unsubscribe
    };
  });

export const txSendingSagasWatcher = function*(): Iterator<any> {
  yield fork(neuTakeEvery, "TX_SENDER_START_WITHDRAW_ETH", withdrawSaga);
  yield fork(neuTakeEvery, "TX_SENDER_START_UPGRADE", upgradeSaga);
  yield fork(neuTakeEvery, "TX_SENDER_START_INVESTMENT", investSaga);
  // Add new transaction types here...
};
