import { put, take } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { actions } from "../actions";

export function* displayInfoModalSaga(
  _: TGlobalDependencies,
  title: string,
  description?: string,
): any {
  yield put(actions.genericModal.showInfoModal(title, description));

  // wait until its dismissed
  yield take("GENERIC_MODAL_HIDE");
}

export function* displayErrorModalSaga(
  _: TGlobalDependencies,
  title: string,
  description?: string,
): any {
  yield put(actions.genericModal.showErrorModal(title, description));

  // wait until its dismissed
  yield take("GENERIC_MODAL_HIDE");
}
