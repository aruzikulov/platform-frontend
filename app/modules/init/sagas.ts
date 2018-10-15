import { LocationChangeAction } from "react-router-redux";
import { effects } from "redux-saga";
import { fork, put, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType } from "../../lib/api/users/interfaces";
import { IAppState } from "../../store";
import { isJwtExpiringLateEnough } from "../../utils/JWTUtils";
import { actions, TAction } from "../actions";
import { loadJwt, loadUser } from "../auth/sagas";
import { selectUserType } from "../auth/selectors";
import { initializeContracts } from "../contracts/sagas";
import { neuCall, neuTakeEvery } from "../sagas";
import { neuTakeOnly } from "../sagasUtils";
import { detectUserAgent } from "../userAgent/sagas";
import { loadPreviousWallet } from "../web3/sagas";

function* initSmartcontracts({ web3Manager, logger }: TGlobalDependencies): any {
  try {
    yield web3Manager.initialize();
    yield neuCall(initializeContracts);

    yield put(actions.init.done("smartcontractsInit"));
  } catch (e) {
    yield put(
      actions.init.error("smartcontractsInit", "Error while connecting with Ethereum blockchain"),
    );
    logger.error("Error: ", e);
  }
}

function* initApp({ logger }: TGlobalDependencies): any {
  try {
    yield neuCall(detectUserAgent);

    const jwt = yield neuCall(loadJwt);

    if (jwt) {
      if (isJwtExpiringLateEnough(jwt)) {
        try {
          // we need to initiate smartcontracts anyway to load user properly
          if (yield checkIfSmartcontractsInitNeeded()) {
            yield neuCall(initSmartcontracts);
          }

          yield loadUser();
          yield neuCall(loadPreviousWallet);
        } catch (e) {
          yield cleanupAndLogoutSaga();
          logger.error(
            "Cannot retrieve account. This could happen b/c account was deleted on backend",
          );
        }
      } else {
        yield cleanupAndLogoutSaga();
        logger.error("JTW expiring too soon.");
      }
    }

    yield put(actions.init.done("appInit"));
  } catch (e) {
    yield put(actions.init.error("appInit", e.message || "Unknown error"));
    logger.error("Error: ", e);
  }
}

export function* initStartSaga(_: TGlobalDependencies, action: TAction): Iterator<any> {
  if (action.type !== "INIT_START") return;

  const { initType } = action.payload;

  switch (initType) {
    case "appInit":
      return yield neuCall(initApp);
    case "smartcontractsInit":
      return yield neuCall(initSmartcontracts);
    case "walletInit":
      return yield put(actions.wallet.startWatchingWalletData());
    default:
      throw new Error("Unrecognized init type!");
  }
}

export function* cleanupAndLogoutSaga(): Iterator<any> {
  const userType: EUserType = yield effects.select((s: IAppState) => selectUserType(s.auth));
  yield put(actions.auth.logout(userType));
  userType === EUserType.INVESTOR
    ? yield put(actions.routing.goToLogin())
    : yield put(actions.routing.goToEtoLogin());
}

export function* checkIfSmartcontractsInitNeeded(): any {
  const isDoneOrInProgress: boolean = yield select(
    (s: IAppState) => s.init.smartcontractsInit.done || s.init.smartcontractsInit.inProgress,
  );

  return !isDoneOrInProgress;
}

/**
 * We don't require app initialization on index (/) page so we are gonna watch location change action until navigation happens
 */
export function* initSmartcontractsDelayed(): any {
  const isNeeded = yield checkIfSmartcontractsInitNeeded();
  if (!isNeeded) {
    return;
  }

  while (true) {
    const action: LocationChangeAction = yield take("@@router/LOCATION_CHANGE");

    if (action.payload && action.payload.pathname !== "/") {
      yield put(actions.init.start("smartcontractsInit"));
      // Wait for "smartcontractsInit" to be done
      yield neuTakeOnly("INIT_DONE", { initType: "smartcontractsInit" });
      yield put(actions.init.start("walletInit"));
      return;
    }
  }
}

export const initSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "INIT_START", initStartSaga);

  yield fork(initSmartcontractsDelayed);
};
