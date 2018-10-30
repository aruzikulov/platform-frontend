import { BigNumber } from "bignumber.js";
import { addHexPrefix } from "ethereumjs-util";
import { END, eventChannel } from "redux-saga";
import { call, put, race, select, take } from "redux-saga/effects";
import * as Web3 from "web3";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { TPendingTxs, TxWithMetadata } from "../../../lib/api/users/interfaces";
import {
  InvalidChangeIdError,
  InvalidRlpDataError,
  LongTransactionQueError,
  LowNonceError,
  NotEnoughEtherForGasError,
  RevertedTransactionError,
  UnknownEthNodeError,
} from "../../../lib/web3/Web3Adapter";
import { IAppState } from "../../../store";
import { delay } from "../../../utils/delay";
import { connectWallet } from "../../access-wallet/sagas";
import { actions } from "../../actions";
import { IGasState } from "../../gas/reducer";
import { selectGasPrice } from "../../gas/selectors";
import { neuCall } from "../../sagas";
import { neuResetIf } from "../../sagasUtils";
import { ETxSenderType } from "../interfaces";
import { updateTxs } from "../monitor/sagas";
import { validateGas } from "../validator/sagas";
import { ITxData } from "./../../../lib/web3/types";
import { OutOfGasError } from "./../../../lib/web3/Web3Adapter";
import { ETransactionErrorType } from "./reducer";
import { selectTxDetails, selectTxType } from "./selectors";

export interface ITxSendParams {
  type: ETxSenderType;
  transactionFlowGenerator: any;
  extraParam?: any;
  // Design extraParam to be a tuple that handels any number of params
  // @see neuCall
}

export function* txSendSaga({ type, transactionFlowGenerator, extraParam }: ITxSendParams): any {
  const gasPrice: IGasState = yield select(selectGasPrice);

  if (!gasPrice) {
    yield take("GAS_API_LOADED");
  }

  const { result, cancel } = yield race({
    result: neuCall(txSendProcess, type, transactionFlowGenerator, extraParam),
    cancel: take("TX_SENDER_HIDE_MODAL"),
  });

  if (cancel) {
    throw new Error("TX_SENDING_CANCELLED");
  }

  // we need to wait for modal to close anyway
  yield take("TX_SENDER_HIDE_MODAL");
  yield put(actions.wallet.loadWalletData());

  return result;
}

export function* txSendProcess(
  { logger }: TGlobalDependencies,
  transactionType: ETxSenderType,
  transactionFlowGenerator: any,
  extraParam?: any,
): any {
  try {
    yield put(actions.txSender.txSenderShowModal(transactionType));
    yield neuCall(ensureNoPendingTx, transactionType);
    yield put(actions.txSender.txSenderWatchPendingTxsDone(transactionType));

    yield neuResetIf("TX_SENDER_CHANGE", "TX_SENDER_ACCEPT", transactionFlowGenerator, extraParam);
    const txData = yield select(selectTxDetails);
    yield validateGas(txData);
    yield call(connectWallet);
    yield put(actions.txSender.txSenderWalletPlugged());
    const txHash = yield neuCall(sendTxSubSaga);
    yield neuCall(watchTxSubSaga, txHash);
  } catch (error) {
    logger.error(error);
    if (error instanceof OutOfGasError) {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.GAS_TOO_LOW));
    } else if (error instanceof LowNonceError) {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.NONCE_TOO_LOW));
    } else if (error instanceof LongTransactionQueError) {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.TOO_MANY_TX_IN_QUEUE));
    } else if (error instanceof InvalidRlpDataError) {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.INVALID_RLP_TX));
    } else if (error instanceof InvalidChangeIdError) {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.INVALID_CHAIN_ID));
    } else if (error instanceof UnknownEthNodeError) {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.TX_WAS_REJECTED));
    } else if (error instanceof NotEnoughEtherForGasError) {
      return yield put(
        actions.txSender.txSenderError(ETransactionErrorType.NOT_ENOUGH_ETHER_FOR_GAS),
      );
    } else {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.UNKNOWN_ERROR));
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
    yield validateGas(txData);

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
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.NOT_ENOUGH_FUNDS));
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
          return yield put(
            actions.txSender.txSenderError(ETransactionErrorType.ERROR_WHILE_WATCHING_TX),
          );
        case EventEmitterChannelEvents.OUT_OF_GAS:
          logger.error("Error Transaction Reverted: ", result.error);
          return yield put(actions.txSender.txSenderError(ETransactionErrorType.OUT_OF_GAS));
        case EventEmitterChannelEvents.REVERTED_TRANSACTION:
          logger.error("Error Transaction Reverted: ", result.error);
          return yield put(actions.txSender.txSenderError(ETransactionErrorType.REVERTED_TX));
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
