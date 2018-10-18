import { fork, put } from "redux-saga/effects";

import { DO_BOOK_BUILDING } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import { EtoPledgeNotFound } from "../../lib/api/eto/EtoPledgeApi";
import { IPledge } from "../../lib/api/eto/EtoPledgeApi.interfaces";
import { actions, TAction } from "../actions";
import { ensurePermissionsArePresent } from "../auth/sagas";
import { neuCall, neuTakeEvery } from "../sagas";
import { DELETE_PLEDGE, LOAD_BOOKBUILDING_FLOW_STATS, LOAD_PLEDGE, SAVE_PLEDGE } from "./actions";

export function* saveMyPledge(
  { apiEtoPledgeService, notificationCenter, logger, intlWrapper }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== SAVE_PLEDGE) return;

  try {
    yield neuCall(
      ensurePermissionsArePresent,
      [DO_BOOK_BUILDING],
      intlWrapper.intl.formatIntlMessage("eto.overview.permission-modal.confirm-pledge"),
    );

    const etoId = action.payload.etoId;
    const pledge = action.payload.pledge;

    const pledgeResult: IHttpResponse<IPledge> = yield apiEtoPledgeService.saveMyPledge(
      etoId,
      pledge,
    );

    yield put(actions.bookBuilding.setPledge(etoId, pledgeResult.body));
    yield put(actions.bookBuilding.loadBookBuildingStats(etoId));
  } catch (e) {
    notificationCenter.error(
      intlWrapper.intl.formatIntlMessage("eto.overview.error-notification.failed-to-save-pledge"),
    );
    logger.error(`Failed to save pledge`, e);
  }
}

export function* deleteMyPledge(
  { apiEtoPledgeService, notificationCenter, logger, intlWrapper }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== DELETE_PLEDGE) return;

  try {
    yield neuCall(
      ensurePermissionsArePresent,
      [DO_BOOK_BUILDING],
      intlWrapper.intl.formatIntlMessage("eto.overview.permission-modal.confirm-pledge"),
    );

    const etoId = action.payload.etoId;

    yield apiEtoPledgeService.deleteMyPledge(etoId);

    yield put(actions.bookBuilding.setPledge(etoId));
    yield put(actions.bookBuilding.loadBookBuildingStats(etoId));
  } catch (e) {
    notificationCenter.error(
      intlWrapper.intl.formatIntlMessage("eto.overview.error-notification.failed-to-delete-pledge"),
    );
    logger.error(`Failed to delete pledge`, e);
  }
}

export function* loadBookBuildingStats(
  { apiEtoService, notificationCenter, logger, intlWrapper }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== LOAD_BOOKBUILDING_FLOW_STATS) return;

  try {
    const etoId = action.payload.etoId;
    const statsResponse: IHttpResponse<any> = yield apiEtoService.getBookBuildingStats(etoId);

    yield put(actions.bookBuilding.setBookBuildingStats(etoId, statsResponse.body));
  } catch (e) {
    notificationCenter.error(
      intlWrapper.intl.formatIntlMessage(
        "eto.overview.error-notification.failed-to-bookbuilding-stats",
      ),
    );

    logger.error(`Failed to load bookbuilding stats pledge`, e);
  }
}

export function* loadMyPledge(
  { apiEtoPledgeService, notificationCenter, logger, intlWrapper }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== LOAD_PLEDGE) return;

  try {
    const etoId = action.payload.etoId;
    const pledgeResponse: IHttpResponse<IPledge> = yield apiEtoPledgeService.getMyPledge(etoId);

    yield put(actions.bookBuilding.setPledge(etoId, pledgeResponse.body));
  } catch (e) {
    if (!(e instanceof EtoPledgeNotFound)) {
      notificationCenter.error(
        intlWrapper.intl.formatIntlMessage("eto.overview.error-notification.failed-to-load-pledge"),
      );

      logger.error("Failed to load pledge", e);
    }
  }
}

export function* bookBuildingFlowSagas(): any {
  yield fork(neuTakeEvery, LOAD_BOOKBUILDING_FLOW_STATS, loadBookBuildingStats);
  yield fork(neuTakeEvery, LOAD_PLEDGE, loadMyPledge);
  yield fork(neuTakeEvery, SAVE_PLEDGE, saveMyPledge);
  yield fork(neuTakeEvery, DELETE_PLEDGE, deleteMyPledge);
}
