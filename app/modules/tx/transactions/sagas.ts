import { fork, put } from "redux-saga/effects";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { TAction } from "../../actions";
import { onInvestmentTxModalHide } from "../../investmentFlow/sagas";
import { neuTakeEvery } from "../../sagas";
import { ETransactionErrorType } from "../sender/reducer";
import { ITxSendParams, txSendSaga, txValidateSaga } from "../sender/sagas";
import { actions } from "./../../actions";
import { ETokenType, ETxSenderType } from "./../sender/reducer";
import { generateInvestmentTransaction } from "./investment/sagas";
import { generateEtherUpgradeTransaction, generateEuroUpgradeTransaction } from "./upgrade/sagas";
import { generateEthWithdrawTransaction } from "./withdraw/sagas";

export function* withdrawSaga({ logger }: TGlobalDependencies): any {
  try {
    yield txSendSaga({
      type: ETxSenderType.WITHDRAW,
      transactionGenerationFunction: generateEthWithdrawTransaction,
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
    yield txSendSaga(params);

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
    });
    logger.info("Investment successful");
  } catch (e) {
    logger.warn("Investment cancelled", e);
  }
}

export const txSendingSagasWatcher = function*(): Iterator<any> {
  yield fork(neuTakeEvery, "TX_SENDER_VALIDATE_DRAFT", txValidateSaga);
  yield fork(neuTakeEvery, "TX_SENDER_START_WITHDRAW_ETH", withdrawSaga);
  yield fork(neuTakeEvery, "TX_SENDER_START_UPGRADE", upgradeSaga);
  yield fork(neuTakeEvery, "TX_SENDER_START_INVESTMENT", investSaga);
  // Add new transaction types here...
};
