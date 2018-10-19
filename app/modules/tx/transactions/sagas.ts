import { fork, put, select } from "redux-saga/effects";
import { selectGasPrice } from "./../../gas/selectors";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { GasModelShape } from "../../../lib/api/GasApi";
import { actions, TAction } from "../../actions";
import { onInvestmentTxModalHide } from "../../investmentFlow/sagas";
import { neuCall, neuTakeEvery } from "../../sagas";
import { ITxSendParams, txSendSaga } from "../sender/sagas";
import { ETxSenderType } from "./../interfaces";
import { generateInvestmentTransaction, INVESTMENT_GAS_AMOUNT } from './investment/sagas';
import { upgradeTransactionFlow } from "./upgrade/sagas";
import { ethWithdrawFlow } from "./withdraw/sagas";

export function* withdrawSaga({ logger }: TGlobalDependencies): any {
  try {
    const withdrawFlowGenerator = neuCall(ethWithdrawFlow);

    yield txSendSaga({
      type: ETxSenderType.WITHDRAW,
      transactionFlowGenerator: withdrawFlowGenerator,
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
    const upgradeFlowGenerator = neuCall(upgradeTransactionFlow, tokenType);
    const params: ITxSendParams = {
      type: ETxSenderType.UPGRADE,
      transactionFlowGenerator: upgradeFlowGenerator,
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
      transactionFlowGenerator: generateInvestmentTransaction,
    });
    logger.info("Investment successful");
  } catch (e) {
    // Add clean up functions here ...
    yield onInvestmentTxModalHide();
    logger.warn("Investment cancelled", e);
  }
}

export const txTransactionsSagasWatcher = function*(): Iterator<any> {
  yield fork(neuTakeEvery, "TRANSACTIONS_START_WITHDRAW_ETH", withdrawSaga);
  yield fork(neuTakeEvery, "TRANSACTIONS_START_UPGRADE", upgradeSaga);
  yield fork(neuTakeEvery, "TRANSACTIONS_START_INVESTMENT", investSaga);
  // Add new transaction types here...
};
