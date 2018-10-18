import { BigNumber } from "bignumber.js";
import { addHexPrefix } from "ethereumjs-util";
import { select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ITxData } from "../../../../lib/web3/Web3Manager";
import {
  selectICBMLockedEtherBalance,
  selectIsEtherUpgradeTargetSet,
  selectIsEuroUpgradeTargetSet,
} from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { selectGasPrice } from "./../../../gas/selectors";
import { selectICBMLockedEuroTokenBalance } from "./../../../wallet/selectors";

export function* generateEuroUpgradeTransaction({ contractsService }: TGlobalDependencies): any {
  const userAddress = yield select(selectEthereumAddressWithChecksum);
  const gasPrice = yield select(selectGasPrice);
  const migrationTarget = yield select(selectIsEuroUpgradeTargetSet);
  const euroBalance = yield select(selectICBMLockedEuroTokenBalance);

  if (!migrationTarget || new BigNumber(euroBalance).isZero()) {
    throw new Error();
    // TODO: Add no balance error
  }

  const txInitialDetails = {
    to: contractsService.icbmEtherLock.address,
    from: userAddress,
    data: contractsService.icbmEuroLock.migrateTx().getData(),
    value: addHexPrefix("0"),
    gasPrice: gasPrice.standard,
  };

  const estimatedGas = yield contractsService.icbmEuroLock
    .migrateTx()
    .estimateGas(txInitialDetails);

  const txDetails: ITxData = {
    ...txInitialDetails,
    gas: addHexPrefix(new BigNumber(estimatedGas).toString(16)),
  };
  return txDetails;
}

export function* generateEtherUpgradeTransaction({ contractsService }: TGlobalDependencies): any {
  const userAddress = yield select(selectEthereumAddressWithChecksum);
  const gasPrice = yield select(selectGasPrice);
  const migrationTarget = yield select(selectIsEtherUpgradeTargetSet);
  const etherBalance = yield select(selectICBMLockedEtherBalance);

  if (!migrationTarget || new BigNumber(etherBalance).equals(0)) {
    throw new Error();
    // TODO: Add no balance error
  }
  const txInput = contractsService.icbmEtherLock.migrateTx().getData();

  const txInitialDetails = {
    to: contractsService.icbmEtherLock.address,
    from: userAddress,
    data: txInput,
    value: "0",
    gasPrice,
  };
  const estimateGas = yield contractsService.icbmEtherLock
    .migrateTx()
    .estimateGas(txInitialDetails);

  const txDetails: ITxData = {
    ...txInitialDetails,
    gas: addHexPrefix(new BigNumber(estimateGas).toString(16)),
  };

  return txDetails;
}
