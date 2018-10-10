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
import { compareBigNumbers, multiplyBigNumbers } from "../../../utils/BigNumberUtils";
import { delay } from "../../../utils/delay";
import { connectWallet } from "../../accessWallet/sagas";
import { actions, TAction } from "../../actions";
import { IGasState } from "../../gas/reducer";
import { onInvestmentTxModalHide } from "../../investmentFlow/sagas";
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
import { ETokenType, ETransactionErrorType, ETxSenderType } from "./reducer";
import { selectTxDetails, selectTxType } from "./selectors";

const INVESTMENT_GAS_AMOUNT = "600000";
const WITHDRAW_GAS_AMOUNT = "100000";

class NotEnoughEtherForGasError extends Error {}

interface ITxSendParams {
  type: ETxSenderType;
  transactionGenerationFunction: any;
  requiresUserInput?: boolean;
  setupGasFunction?: any;
  cleanupFunction?: any;
  predefinedGasLimit?: string;
}

export function* withdrawSaga({ logger }: TGlobalDependencies): any {
  try {
    yield txSendSaga({
      type: ETxSenderType.WITHDRAW,
      transactionGenerationFunction: generateEthWithdrawTransaction,
      predefinedGasLimit: WITHDRAW_GAS_AMOUNT,
    });

    logger.info("Withdrawing successful");
  } catch (e) {
    logger.warn("Withdrawing cancelled", e);
  }
}

export function* upgradeSaga({ logger }: TGlobalDependencies, action: TAction): any {
  try {
    if (action.type !== "TX_SENDER_START_UPGRADE") return;

    const params: ITxSendParams = {
      type: ETxSenderType.UPGRADE,
      requiresUserInput: false,
      transactionGenerationFunction:
        action.payload === ETokenType.EURO
          ? generateEuroUpgradeTransaction
          : generateEtherUpgradeTransaction,
    };

    txSendSaga(params);

    logger.info("Withdrawing successful");
  } catch (e) {
    logger.error("Upgrade Saga Error", e);
    return yield put(actions.txSender.txSenderError(ETransactionErrorType.FAILED_TO_GENERATE_TX));
  }
}

export function* investSaga({ logger }: TGlobalDependencies): any {
  try {
    yield txSendSaga({
      type: ETxSenderType.INVEST,
      transactionGenerationFunction: generateInvestmentTransaction,
      cleanupFunction: onInvestmentTxModalHide,
      predefinedGasLimit: INVESTMENT_GAS_AMOUNT,
    });
    logger.info("Investment successful");
  } catch (e) {
    logger.warn("Investment cancelled", e);
  }
}

function* defaultGasPriceFunction(predefinedGasLimit?: string): any {
  const s: IAppState = yield select();
  yield put(actions.txSender.setGasPrice(s.gas.gasPrice!.standard));
  if (predefinedGasLimit) {
    yield put(actions.txSender.setGasLimit(predefinedGasLimit));
  }
}

export function* txSendSaga({
  type,
  transactionGenerationFunction,
  setupGasFunction = defaultGasPriceFunction,
  requiresUserInput = true,
  cleanupFunction,
  predefinedGasLimit,
}: ITxSendParams): any {
  const { result, cancel } = yield race({
    result: neuCall(
      txSendProcess,
      type,
      setupGasFunction,
      transactionGenerationFunction,
      requiresUserInput,
      predefinedGasLimit,
    ),
    cancel: take("TX_SENDER_HIDE_MODAL"),
  });

  if (cancel) {
    if (cleanupFunction) yield cleanupFunction();
    throw new Error("TX_SENDING_CANCELLED");
  }

  // we need to wait for modal to close anyway
  yield take("TX_SENDER_HIDE_MODAL");
  yield put(actions.wallet.startLoadingWalletData());

  return result;
}

export function* txSendProcess(
  { logger }: TGlobalDependencies,
  transactionType: ETxSenderType,
  setupGasFunction: any,
  transactionGenerationFunction: any,
  requiresUserInput: boolean,
  predefinedGasLimit?: string,
): any {
  try {
    yield put(actions.gas.gasApiEnsureLoading());
    yield put(actions.txSender.txSenderShowModal(transactionType));

    yield neuCall(ensureNoPendingTx, transactionType);

    const gas: IGasState = yield select((s: IAppState) => s.gas);
    if (!gas.gasPrice) {
      yield take("GAS_API_LOADED");
    }
    yield call(setupGasFunction, predefinedGasLimit);

    let txDetails;
    if (requiresUserInput) {
      yield put(actions.txSender.txSenderWatchPendingTxsDone(transactionType));
      txDetails = yield take("TX_SENDER_ACCEPT_DRAFT");
    }

    yield neuCall(transactionGenerationFunction, txDetails);
    yield neuCall(validateGas);

    yield take("TX_SENDER_ACCEPT");

    yield call(connectWallet, "Send funds!");
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

function* validateGas(): any {
  const s: IAppState = yield select();
  const txDetails = selectTxDetails(s.txSender);

  if (!txDetails) {
    throw new Error("TxDetails are undefined");
  }

  if (
    compareBigNumbers(
      multiplyBigNumbers([txDetails.gasPrice, txDetails.gas]),
      s.wallet.data!.etherBalance,
    ) > 0
  ) {
    throw new NotEnoughEtherForGasError("Not enough Ether to pay the Gas for this transaction");
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

export const txSendingSagasWatcher = function*(): Iterator<any> {
  yield fork(neuTakeEvery, "TX_SENDER_START_WITHDRAW_ETH", withdrawSaga);
  yield fork(neuTakeEvery, "TX_SENDER_START_UPGRADE", upgradeSaga);
  yield fork(neuTakeEvery, "TX_SENDER_START_INVESTMENT", investSaga);
  // Add new transaction types here...
};
