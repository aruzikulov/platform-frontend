import { effects } from "redux-saga";
import { fork } from "redux-saga/effects";
import { EUserType } from "../../lib/api/users/interfaces";
import { IAppState } from "../../store";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { loadPreviousWallet } from "../web3/sagas";
import { selectUrlUserType } from "./selectors";

export function* loadWalletFromUrl(): Iterator<any> {
  const userType: EUserType = yield effects.select((s: IAppState) => selectUrlUserType(s.router));
  yield neuCall(loadPreviousWallet, userType);
}

export function* walletSelectorSagas(): Iterator<any> {
  yield fork(neuTakeEvery, "WALLET_SELECTOR_RESET", loadWalletFromUrl);
}
