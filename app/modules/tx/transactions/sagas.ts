import { fork } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { TAction } from "../../actions";
import { onInvestmentTxModalHide } from "../../investment-flow/sagas";
import { neuTakeLatest } from "../../sagas";
import { ITxSendParams, txSendSaga } from "../sender/sagas";
import { ETxSenderType } from "./../interfaces";
import { investmentFlowGenerator } from "./investment/sagas";
import { upgradeTransactionFlow } from "./upgrade/sagas";
import { ethWithdrawFlow } from "./withdraw/sagas";

export function* withdrawSaga({ logger }: TGlobalDependencies): any {
  try {
    yield txSendSaga({
      type: ETxSenderType.WITHDRAW,
      transactionFlowGenerator: ethWithdrawFlow,
    });
    logger.info("Withdrawing successful");
  } catch (e) {
    logger.warn("Withdrawing cancelled", e);
  }
}

export function* upgradeSaga({ logger }: TGlobalDependencies, action: TAction): any {
  try {
    if (action.type !== "TRANSACTIONS_START_UPGRADE") return;

    const tokenType = action.payload;
    const params: ITxSendParams = {
      type: ETxSenderType.UPGRADE,
      transactionFlowGenerator: upgradeTransactionFlow,
      extraParam: tokenType,
    };
    yield txSendSaga(params);

    logger.info("Upgrading successful");
  } catch (e) {
    logger.warn("Upgrading cancelled", e);
  }
}

export function* investSaga({ logger }: TGlobalDependencies): any {
  try {
    yield txSendSaga({
      type: ETxSenderType.INVEST,
      transactionFlowGenerator: investmentFlowGenerator,
    });
    logger.info("Investment successful");
  } catch (e) {
    // Add clean up functions here ...
    yield onInvestmentTxModalHide();
    logger.warn("Investment cancelled", e);
  }
}

export const txTransactionsSagasWatcher = function*(): Iterator<any> {
  yield fork(neuTakeLatest, "TRANSACTIONS_START_WITHDRAW_ETH", withdrawSaga);
  yield fork(neuTakeLatest, "TRANSACTIONS_START_UPGRADE", upgradeSaga);
  yield fork(neuTakeLatest, "TRANSACTIONS_START_INVESTMENT", investSaga);
  // Add new transaction types here...
};
