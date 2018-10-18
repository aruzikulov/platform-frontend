import { BigNumber } from "bignumber.js";
import { select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { GasModelShape } from "../../../../lib/api/GasApi";
import { selectEtherTokenBalance } from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { ITxData } from "./../../../../lib/web3/Web3Manager";
import { selectGasPrice } from "./../../../gas/selectors";
import { IDraftType } from "./../../sender/actions";

const WITHDRAW_GAS_LIMIT = "100000";

export function* generateEthWithdrawTransaction(
  { contractsService }: TGlobalDependencies,
  payload: IDraftType,
): any {
  const { to, value } = payload;

  const etherTokenBalance: string | undefined = yield select(selectEtherTokenBalance);
  const from: string = yield select(selectEthereumAddressWithChecksum);
  const gasPrice: GasModelShape | undefined = yield select(selectGasPrice);

  // transaction can be fully covered by etherTokens
  const ethVal = new BigNumber(value);
  const txInput = contractsService.etherToken.withdrawAndSendTx(to, ethVal).getData();
  const difference = ethVal.sub(etherTokenBalance!);

  // txDetails main purpose is type safety
  const txDetails: ITxData = {
    to: contractsService.etherToken.address,
    from,
    data: txInput,
    value: difference.comparedTo(0) > 0 ? difference.toString() : "0",
    gas: WITHDRAW_GAS_LIMIT,
    gasPrice: gasPrice!.standard,
  };

  return txDetails;
}