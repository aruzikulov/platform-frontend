import { cancel, take } from "redux-saga/effects";
import { TGlobalDependencies } from "../di/setupBindings";
import { TActionType } from "./actions";
import { neuFork } from "./sagas";

/**
 * Starts saga on `startAction`, cancels on `stopAction`, loops...
 */
export function* neuTakeUntil(
  startAction: TActionType | TActionType[],
  stopAction: TActionType | TActionType[],
  saga: (deps: TGlobalDependencies) => any,
): any {
  const startActionArray = Array.isArray(startAction) ? startAction : [startAction];
  const stopActionArray = Array.isArray(stopAction) ? stopAction : [stopAction];

  while (yield take(startActionArray)) {
    const cancelForkToken = yield neuFork(saga);

    yield yield take(stopActionArray);
    yield cancel(cancelForkToken);
  }
}

/**
 *  Awaits an Action with specific payload
 */
export function* neuTakeOnly(action: TActionType, payload: any): any {
  // TODO: Remove Any and add correct type similar to "TActionType"
  while (true) {
    const takenAction = yield take(action);
    if (JSON.stringify(takenAction.payload) === JSON.stringify(payload)) return;
  }
}
