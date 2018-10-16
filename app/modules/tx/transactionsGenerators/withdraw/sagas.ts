import { BigNumber } from "bignumber.js";
import { select } from "redux-saga/effects";
import { TxData } from "web3";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { IAppState } from "../../../../store";
import { TAction } from "../../../actions";
import { selectEtherTokenBalance } from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";

const WITHDRAW_GAS_LIMIT = "100000";

export function* generateEthWithdrawTransaction(
  { contractsService }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "TX_SENDER_ACCEPT_DRAFT") return;

  const txStateDetails = action.payload;

  if (!txStateDetails) return;
  const etherTokenBalance = yield select((s: IAppState) => selectEtherTokenBalance(s.wallet));
  const from = yield select(selectEthereumAddressWithChecksum);

  // transaction can be fully covered by etherTokens

  const txInput = contractsService.etherToken
    .withdrawAndSendTx(txStateDetails.to, new BigNumber(txStateDetails.value))
    .getData();
  const ethVal = new BigNumber(txStateDetails.value);
  const difference = ethVal.sub(etherTokenBalance!);

  const txDetails: TxData = {
    to: contractsService.etherToken.address,
    from,
    data: txInput,
    value: difference.comparedTo(0) > 0 ? difference.toString() : "0",
    gas: WITHDRAW_GAS_LIMIT,
  };
  yield put(actions.txSender.setSummaryData(txStateDetails));
  return txDetails;
}
