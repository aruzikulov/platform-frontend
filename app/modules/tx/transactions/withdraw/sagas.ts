import { put, select, take } from "redux-saga/effects";
import { Q18 } from "./../../../../config/constants";
import { TAction } from "./../../../actions";

import BigNumber from "bignumber.js";
import { TGlobalDependencies } from "../../../../di/setupBindings";
import { GasModelShape } from "../../../../lib/api/GasApi";
import { ITxData } from "../../../../lib/web3/types";
import { actions } from "../../../actions";
import { neuCall } from "../../../sagas";
import { selectEtherTokenBalanceAsBigNumber } from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { IDraftType } from "../../interfaces";
import { EMPTY_DATA } from "../../utils";
import { selectGasPrice } from "./../../../gas/selectors";

const SIMPLE_WITHDRAW_TRANSACTION = "21000";

export function* generateEthWithdrawTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  payload: IDraftType,
): any {
  const { to, value } = payload;

  const etherTokenBalance: BigNumber = yield select(selectEtherTokenBalanceAsBigNumber);
  const from: string = yield select(selectEthereumAddressWithChecksum);
  const gasPrice: GasModelShape | undefined = yield select(selectGasPrice);

  const weiValue = Q18.mul(value);

  if (etherTokenBalance.comparedTo(0) < 0) {
    // transaction can be fully covered ether balance
    const txDetails: Partial<ITxData> = {
      to,
      from,
      data: EMPTY_DATA,
      value: weiValue.toString(),
      gasPrice: gasPrice!.standard,
      gas: SIMPLE_WITHDRAW_TRANSACTION,
    };
    return txDetails;
  } else {
    // transaction can be fully covered by etherTokens
    const txInput = contractsService.etherToken.withdrawAndSendTx(to || "0x0", weiValue).getData();

    const difference = weiValue.sub(etherTokenBalance);

    const txDetails: Partial<ITxData> = {
      to: contractsService.etherToken.address,
      from,
      data: txInput,
      value: difference.comparedTo(0) > 0 ? difference.toString() : "0",
      gasPrice: gasPrice!.standard,
    };
    const estimatedGas = yield web3Manager.estimateGasWithOverhead(txDetails);
    return { ...txDetails, gas: estimatedGas };
  }
}

export function* ethWithdrawFlow(_: TGlobalDependencies): any {
  const action: TAction = yield take("TX_SENDER_ACCEPT_DRAFT");
  if (action.type !== "TX_SENDER_ACCEPT_DRAFT") return;
  const txDataFromUser = action.payload;
  yield put(
    actions.txSender.setSummaryData({
      ...txDataFromUser,
      value: Q18.mul(txDataFromUser.value!).toString(),
    }),
  );
  const generatedTxDetails = yield neuCall(generateEthWithdrawTransaction, txDataFromUser);
  yield put(actions.txSender.setTransactionData(generatedTxDetails));
}
