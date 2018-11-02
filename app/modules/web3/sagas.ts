import { delay, Task } from "redux-saga";
import { call, cancel, fork, put } from "redux-saga/effects";
import { LIGHT_WALLET_PASSWORD_CACHE_TIME } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType } from "../../lib/api/users/interfaces";
import { LightWallet, LightWalletWrongPassword } from "../../lib/web3/LightWallet";
import { actions, TAction } from "../actions";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { EWalletType } from "./types";

let lockWalletTask: Task | undefined;
export function* autoLockLightWallet({ web3Manager, logger }: TGlobalDependencies): Iterator<any> {
  logger.info(`Resetting light wallet password in ${LIGHT_WALLET_PASSWORD_CACHE_TIME} ms`);
  yield call(delay, LIGHT_WALLET_PASSWORD_CACHE_TIME);
  if (web3Manager.personalWallet) {
    logger.info("Resetting light wallet password now");
    yield put(actions.web3.walletLocked());
    (web3Manager.personalWallet as LightWallet).password = undefined;
    yield put(actions.web3.clearSeedFromState()); //Better to clear the seed here as well
  }
}

export function* autoLockLightWalletWatcher(
  _deps: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (lockWalletTask) {
    yield cancel(lockWalletTask);
  }
  if (
    action.type === "NEW_PERSONAL_WALLET_PLUGGED" &&
    action.payload.walletMetadata.walletType !== EWalletType.LIGHT
  ) {
    return;
  }
  lockWalletTask = yield neuCall(autoLockLightWallet);
}

export function* cancelLocking(): Iterator<any> {
  if (lockWalletTask) {
    yield cancel(lockWalletTask);
  }
}

export function* unlockWallet(
  { web3Manager }: TGlobalDependencies,
  password: string,
): Iterator<any> {
  const lightWallet = web3Manager.personalWallet as LightWallet;

  const isPasswordCorrect = yield lightWallet.testPassword(password);
  if (!isPasswordCorrect) {
    throw new LightWalletWrongPassword();
  }

  lightWallet.password = password;
  yield put(actions.web3.walletUnlocked());
}

export function* loadPreviousWallet(
  { walletStorage }: TGlobalDependencies,
  forcedUserType?: EUserType,
): Iterator<any> {
  //forcedUserType can still pass as undefined
  const storageData = walletStorage.get(forcedUserType);
  if (storageData) {
    yield put(actions.web3.loadPreviousWallet(storageData));
  }
}

export const web3Sagas = function*(): Iterator<any> {
  yield fork(
    neuTakeEvery,
    ["NEW_PERSONAL_WALLET_PLUGGED", "WEB3_WALLET_UNLOCKED"],
    autoLockLightWalletWatcher,
  );
  yield fork(neuTakeEvery, ["PERSONAL_WALLET_DISCONNECTED", "WEB3_WALLET_LOCKED"], cancelLocking);
};
