import { put, select, take } from "redux-saga/effects";
import { Q18 } from "./../../../../config/constants";
import { TAction } from "./../../../actions";
import { calculateGasPriceWithOverhead } from "./../../utils";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { GasModelShape } from "../../../../lib/api/GasApi";
import { ITxData } from "../../../../lib/web3/types";
import { actions } from "../../../actions";
import { neuCall } from "../../../sagas";
import { selectEtherBalance, selectEtherTokenBalance } from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { IDraftType } from "../../interfaces";
import { EMPTY_DATA } from "../../utils";
import { selectGasPrice } from "./../../../gas/selectors";

const WITHDRAW_GAS_LIMIT = "100000";

export function* generateEthWithdrawTransaction(
  { contractsService }: TGlobalDependencies,
  payload: IDraftType,
): any {
  const { to, value } = payload;

  const etherTokenBalance: string = yield select(selectEtherTokenBalance);
  const from: string = yield select(selectEthereumAddressWithChecksum);
  const gasPrice: GasModelShape | undefined = yield select(selectGasPrice);
  const etherBalance: string = yield select(selectEtherBalance);

  const ethVal = Q18.mul(value || "0");
  if (ethVal.comparedTo(etherBalance) < 0) {
    // transaction can be fully covered ether balance
    const txDetails: ITxData = {
      to,
      from,
      data: EMPTY_DATA,
      value: ethVal.toString(),
      gas: calculateGasPriceWithOverhead(WITHDRAW_GAS_LIMIT),
      gasPrice: gasPrice!.standard,
    };
    return txDetails;
  } else {
    // transaction can be fully covered by etherTokens
    const txInput = contractsService.etherToken.withdrawAndSendTx(to || "0x0", ethVal).getData();
    const difference = ethVal.sub(etherTokenBalance);

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
