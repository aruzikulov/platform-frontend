import { effects } from "redux-saga";
import { call, spawn, takeEvery } from "redux-saga/effects";

import { TGlobalDependencies } from "../di/setupBindings";
import { TAction } from "./actions";
import { authSagas } from "./auth/sagas";
import { bookBuildingFlowSagas } from "./bookbuilding-flow/sagas";
import { etoDocumentsSagas } from "./eto-documents/sagas";
import { etoFlowSagas } from "./eto-flow/sagas";
import { gasApiSagas } from "./gas/sagas";
import { icbmWalletGetDataSagas } from "./icbmWalletBalanceModal/sagas";
import { immutableFileSagas } from "./immutableFile/sagas";
import { initSagas } from "./init/sagas";
import { investmentFlowSagas } from "./investmentFlow/sagas";
import { investorTicketsSagas } from "./investor-tickets/sagas";
import { kycSagas } from "./kyc/sagas";
import { etoSagas } from "./public-etos/sagas";
import { settingsSagas } from "./settings/sagas";
import { formSingleFileUploadSagas } from "./shared/formSingleFileUpload/sagas";
import { remoteFileSagas } from "./shared/remoteFile/sagas";
import { tokenPriceSagas } from "./shared/tokenPrice/sagas";
import { txMonitorSagas } from "./tx/monitor/sagas";
import { txSendingSagasWatcher } from "./tx/sender/sagas";
import { txTransactionsSagasWatcher } from "./tx/transactions/sagas";
import { lightWalletSagas } from "./wallet-selector/light-wizard/sagas";
import { walletSelectorSagas } from "./wallet-selector/sagas";
import { walletSagas } from "./wallet/sagas";
import { web3Sagas } from "./web3/sagas";

/**
 * Restart all sagas on error and report error to sentry
 */
function* allSagas(): Iterator<effects.Effect> {
  yield effects.all([
    effects.fork(kycSagas),
    effects.fork(investorTicketsSagas),
    effects.fork(initSagas),
    effects.fork(settingsSagas),
    effects.fork(web3Sagas),
    effects.fork(authSagas),
    effects.fork(walletSelectorSagas),
    effects.fork(lightWalletSagas),
    effects.fork(walletSagas),
    effects.fork(icbmWalletGetDataSagas),
    effects.fork(etoFlowSagas),
    effects.fork(immutableFileSagas),
    effects.fork(etoSagas),
    effects.fork(bookBuildingFlowSagas),
    effects.fork(formSingleFileUploadSagas),
    effects.fork(remoteFileSagas),
    effects.fork(txSendingSagasWatcher),
    effects.fork(txTransactionsSagasWatcher),
    effects.fork(gasApiSagas),
    effects.fork(etoDocumentsSagas),
    effects.fork(txMonitorSagas),
    effects.fork(tokenPriceSagas),
    effects.fork(investmentFlowSagas),
  ]);
}

export function* rootSaga(): Iterator<effects.Effect> {
  while (true) {
    try {
      yield effects.call(allSagas);
    } catch (e) {
      // tslint:disable-next-line
      console.error("ERROR IN TOP LEVEL SAGA HANDLER", e);
    }
  }
}

/**
 * Helpers
 */
type TActionType = TAction["type"];

export function* neuTakeLatest(
  type: TActionType | Array<string>,
  saga: (deps: TGlobalDependencies, action: TAction) => any,
): Iterator<effects.Effect> {
  const deps: TGlobalDependencies = yield effects.getContext("deps");
  yield takeLatest(type, saga, deps);
}

export function* neuTakeEvery(
  type: TActionType | Array<string>,
  saga: (deps: TGlobalDependencies, action: TAction) => any,
): Iterator<effects.Effect> {
  const deps: TGlobalDependencies = yield effects.getContext("deps");
  yield takeEvery(type, saga, deps);
}

export function* neuFork(
  saga: (deps: TGlobalDependencies, ...args: any[]) => any,
  ...args: any[]
): Iterator<effects.Effect> {
  const deps: TGlobalDependencies = yield effects.getContext("deps");
  return yield spawn(saga, deps, args[0], args[1], args[2], args[3], args[4]);
}

export function* neuCall(
  saga: (deps: TGlobalDependencies, ...args: any[]) => any,
  ...args: any[]
): Iterator<effects.Effect> {
  const deps: TGlobalDependencies = yield effects.getContext("deps");
  return yield call(saga, deps, args[0], args[1], args[2], args[3], args[4]);
}
