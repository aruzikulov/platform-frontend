import { isEqual } from "lodash/fp";
import { cancel, race, take } from "redux-saga/effects";
import { TGlobalDependencies } from "../di/setupBindings";
import { TActionType } from "./actions";
import { neuCall, neuFork } from "./sagas";

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
    if (isEqual(takenAction.payload, payload)) return;
  }
}

/**
 *  Executes the generator and repeats if repeatAction was dispatched. Exits when endAction
 *  is dispatched.
 */
export function* neuRepeatIf(
  repeatAction: TActionType | TActionType[],
  endAction: TActionType | TActionType[],
  generator: any,
  extraParam?: any,
): any {
  while (true) {
    yield neuCall(generator, extraParam);

    const { change, accept } = yield race({
      change: take(repeatAction),
      accept: take(endAction),
    });
    if (change) {
      continue;
    }
    if (accept) {
      return;
    }
  }
}
