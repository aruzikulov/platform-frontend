import { BigNumber } from "bignumber.js";
import { put,select, take } from "redux-saga/effects";
import { TAction } from "./../../../actions";
import { calculateGasPriceWithOverhead } from './../../utils';

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { GasModelShape } from "../../../../lib/api/GasApi";
import { actions } from "../../../actions";
import { neuCall } from "../../../sagas";
import { selectEtherTokenBalance } from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { IDraftType } from "../../interfaces";
import { ITxData } from "./../../../../lib/web3/Web3Manager";
import { selectGasPrice } from "./../../../gas/selectors";

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
    gas: calculateGasPriceWithOverhead(WITHDRAW_GAS_LIMIT),
    gasPrice: gasPrice!.standard,
  };

  return txDetails;
}

export function* ethWithdrawFlow(_: TGlobalDependencies): any {
  const action: TAction = yield take("TX_SENDER_ACCEPT_DRAFT");
  if (action.type !== "TX_SENDER_ACCEPT_DRAFT") return;
  const txDataFromUser = action.payload;
  yield put(actions.txSender.setSummaryData(txDataFromUser));
  const generatedTxDetails = yield neuCall(generateEthWithdrawTransaction, txDataFromUser);
  return generatedTxDetails;
}
