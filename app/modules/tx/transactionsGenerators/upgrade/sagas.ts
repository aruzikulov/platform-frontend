import { BigNumber } from "bignumber.js";
import { put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ITxInitData } from "../../../../lib/web3/Web3Manager";
import { IAppState } from "../../../../store";
import { actions } from "../../../actions";
import {
  selectICBMLockedEtherBalance,
  selectIsEtherUpgradeTargetSet,
  selectIsEuroUpgradeTargetSet,
} from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { selectICBMLockedEuroTokenBalance } from "./../../../wallet/selectors";

export function* generateEuroUpgradeTransaction({ contractsService }: TGlobalDependencies): any {
  const state: IAppState = yield select();
  const userAddress = selectEthereumAddressWithChecksum(state.web3);
  const migrationTarget = selectIsEuroUpgradeTargetSet(state.wallet);
  const euroBalance = selectICBMLockedEuroTokenBalance(state.wallet);

  if (!migrationTarget || new BigNumber(euroBalance).isZero()) {
    throw new Error();
    // TODO: Add no balance error
  }
  const txInput = contractsService.icbmEuroLock.migrateTx().getData();

  const txDetails: ITxInitData = {
    to: contractsService.icbmEuroLock.address,
    from: userAddress,
    data: txInput,
    value: "0",
  };

  const estimatedGas = yield contractsService.icbmEuroLock.migrateTx().estimateGas(txDetails);
  yield put(actions.txSender.setGasLimit(estimatedGas));

  yield put(actions.txSender.txSenderAcceptDraft(txDetails));
}

export function* generateEtherUpgradeTransaction({ contractsService }: TGlobalDependencies): any {
  const state: IAppState = yield select();
  const userAddress = selectEthereumAddressWithChecksum(state.web3);
  const migrationTarget = selectIsEtherUpgradeTargetSet(state.wallet);
  const etherBalance = selectICBMLockedEtherBalance(state.wallet);

  if (!migrationTarget || new BigNumber(etherBalance).equals(0)) {
    throw new Error();
    // TODO: Add no balance error
  }
  const txInput = contractsService.icbmEtherLock.migrateTx().getData();

  const txDetails: ITxInitData = {
    to: contractsService.icbmEtherLock.address,
    from: userAddress,
    data: txInput,
    value: "0",
    gasPrice: state.txSender.gasPrice,
  };

  const estimatedGas = yield contractsService.icbmEtherLock.migrateTx().estimateGas(txDetails);
  yield put(actions.txSender.setGasLimit(estimatedGas));

  yield put(actions.txSender.txSenderAcceptDraft(txDetails));
}
