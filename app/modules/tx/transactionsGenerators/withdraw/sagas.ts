import { BigNumber } from "bignumber.js";
import { put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { IAppState } from "../../../../store";
import { actions, TAction } from "../../../actions";
import { selectEtherTokenBalance } from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";

export function* generateEthWithdrawTransaction(
  { contractsService }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "TX_SENDER_ACCEPT_DRAFT") return;

  const txStateDetails = action.payload;

  if (!txStateDetails) return;
  const s: IAppState = yield select();
  const etherTokenBalance = selectEtherTokenBalance(s.wallet);
  const from = selectEthereumAddressWithChecksum(s.web3);

  // transaction can be fully covered by etherTokens

  const txInput = contractsService.etherToken
    .withdrawAndSendTx(txStateDetails.to, new BigNumber(txStateDetails.value))
    .getData();
  const ethVal = new BigNumber(txStateDetails.value);
  const difference = ethVal.sub(etherTokenBalance!);

  const txDetails = {
    to: contractsService.etherToken.address,
    from,
    data: txInput,
    value: difference.comparedTo(0) > 0 ? difference.toString() : "0",
  };

  yield put(actions.txSender.setSummaryData(txStateDetails));
  yield put(actions.txSender.txSenderAcceptDraft(txDetails));
}
