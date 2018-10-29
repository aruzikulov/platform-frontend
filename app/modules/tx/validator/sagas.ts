import { fork, put, select } from "redux-saga/effects";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { ITxData } from "../../../lib/web3/types";
import { NotEnoughEtherForGasError } from "../../../lib/web3/Web3Adapter";
import {
  compareBigNumbers,
  multiplyBigNumbers,
  subtractBigNumbers,
} from "../../../utils/BigNumberUtils";
import { actions, TAction } from "../../actions";
import { neuCall, neuTakeEvery } from "../../sagas";
import { selectEtherBalance } from "../../wallet/selectors";
import { EValidationState } from "../sender/reducer";
import { generateEthWithdrawTransaction } from "../transactions/withdraw/sagas";

export function* txValidateSaga({ logger }: TGlobalDependencies, action: TAction): any {
  try {
    if (action.type !== "TX_SENDER_VALIDATE_DRAFT") return;
    const generatedTxDetails: ITxData = yield neuCall(
      generateEthWithdrawTransaction,
      action.payload,
    );
    yield validateGas(generatedTxDetails);
    yield put(actions.txValidator.setValidationState(EValidationState.VALIDATION_OK));
  } catch (error) {
    logger.error(error);
    yield put(actions.txValidator.setValidationState(EValidationState.NOT_ENOUGH_ETHER_FOR_GAS));
  }
}

function* validateGas(txDetails: ITxData): any {
  const etherBalance: string | undefined = yield select(selectEtherBalance);

  if (!etherBalance) {
    throw new Error("Ether Balance is undefined");
  }

  if (
    compareBigNumbers(
      multiplyBigNumbers([txDetails.gasPrice, txDetails.gas]),
      subtractBigNumbers([etherBalance, txDetails.value.toString()]),
    ) > 0
  ) {
    throw new NotEnoughEtherForGasError("Not enough Ether to pay the Gas for this transaction");
  }
}

export const txValidatorSagasWatcher = function*(): Iterator<any> {
  yield fork(neuTakeEvery, "TX_SENDER_VALIDATE_DRAFT", txValidateSaga);
};
