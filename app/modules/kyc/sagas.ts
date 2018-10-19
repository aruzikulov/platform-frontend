import { cancel, fork, put, select, take } from "redux-saga/effects";

import { actions, TAction } from "../actions";

import { neuCall, neuTakeEvery } from "../sagas";

import { delay } from "redux-saga";
import { SUBMIT_KYC_PERMISSION } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import {
  IKycBeneficialOwner,
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  IKycRequestState,
  TRequestOutsourcedStatus,
  TRequestStatus,
} from "../../lib/api/KycApi.interfaces";
import { IAppAction, IAppState } from "../../store";
import { ensurePermissionsArePresent } from "../auth/sagas";
import { displayErrorModalSaga } from "../generic-modal/sagas";
import {
  selectCombinedBeneficialOwnerOwnership,
  selectKycRequestOutsourcedStatus,
  selectKycRequestStatus,
} from "./selectors";

function* loadClientData(): any {
  yield put(actions.kyc.kycLoadIndividualData());
  yield put(actions.kyc.kycLoadBusinessData());
}

/**
 * whole watcher feature is just a temporary workaround for a lack of real time communication with backend
 */
let kycWidgetWatchDelay: number = 1000;
function* kycRefreshWidgetSaga(): any {
  kycWidgetWatchDelay = 1000;

  while (true) {
    const status: TRequestStatus | undefined = yield select((s: IAppState) =>
      selectKycRequestStatus(s.kyc),
    );

    // if its accepted we can stop whole mechanism
    if (status === "Accepted") {
      return;
    }

    const outsourcedStatus: TRequestOutsourcedStatus | undefined = yield select((s: IAppState) =>
      selectKycRequestOutsourcedStatus(s.kyc),
    );

    if (
      outsourcedStatus === "started" ||
      outsourcedStatus === "canceled" ||
      outsourcedStatus === "aborted" ||
      outsourcedStatus === "review_pending"
    ) {
      yield put(actions.kyc.kycLoadIndividualRequest(true));
    }

    yield delay(kycWidgetWatchDelay);
    expandWatchTimeout();
  }
}

// it will sleep for 1000, 3000, and then always 10 000
function expandWatchTimeout(): void {
  // tslint:disable-next-line
  if (kycWidgetWatchDelay === 1000) {
    kycWidgetWatchDelay = 3000;
  } else {
    kycWidgetWatchDelay = 10000;
  }
}

let watchTask: any;
function* kycRefreshWidgetSagaWatcher(): any {
  while (true) {
    yield take("KYC_WATCHER_START");
    watchTask = yield fork(kycRefreshWidgetSaga);
  }
}

function* kycRefreshWidgetSagaWatcherStop(): any {
  while (true) {
    yield take("KYC_WATCHER_STOP");
    yield cancel(watchTask);
  }
}

/**
 * Individual Request
 */
function* loadIndividualData(
  { apiKycService }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_INDIVIDUAL_DATA") return;
  try {
    yield put(actions.kyc.kycUpdateIndividualData(true));
    const result: IHttpResponse<IKycIndividualData> = yield apiKycService.getIndividualData();
    yield put(actions.kyc.kycUpdateIndividualData(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateIndividualData(false));
  }
}

function* submitIndividualData(
  {
    apiKycService,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_INDIVIDUAL_FORM") return;
  try {
    const result: IHttpResponse<IKycIndividualData> = yield apiKycService.putIndividualData(
      action.payload.data,
    );
    yield put(actions.kyc.kycUpdateIndividualData(false, result.body));
    yield put(actions.routing.goToKYCIndividualInstantId());
  } catch {
    notificationCenter.error(formatIntlMessage("module.kyc.sagas.problem-sending-data"));
  }
}

function* uploadIndividualFile(
  {
    apiKycService,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_UPLOAD_INDIVIDUAL_FILE") return;
  const { file } = action.payload;
  try {
    yield put(actions.kyc.kycUpdateIndividualDocument(true));
    const result: IHttpResponse<IKycFileInfo> = yield apiKycService.uploadIndividualDocument(file);
    yield put(actions.kyc.kycUpdateIndividualDocument(false, result.body));
    notificationCenter.info(formatIntlMessage("module.kyc.sagas.successfully-uploaded"));
  } catch {
    yield put(actions.kyc.kycUpdateIndividualDocument(false));
    notificationCenter.error(formatIntlMessage("module.kyc.sagas.problem-uploading"));
  }
}

function* loadIndividualFiles(
  { apiKycService }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_INDIVIDUAL_FILE_LIST") return;
  try {
    yield put(actions.kyc.kycUpdateIndividualDocuments(true));
    const result: IHttpResponse<IKycFileInfo[]> = yield apiKycService.getIndividualDocuments();
    yield put(actions.kyc.kycUpdateIndividualDocuments(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateIndividualDocuments(false));
  }
}

function* loadIndividualRequest(
  { apiKycService, logger }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_INDIVIDUAL_REQUEST_STATE") return;
  try {
    if (!action.payload.inBackground) {
      yield put(actions.kyc.kycUpdateIndividualRequestState(true));
    }
    const result: IHttpResponse<IKycRequestState> = yield apiKycService.getIndividualRequest();
    yield put(actions.kyc.kycUpdateIndividualRequestState(false, result.body));
  } catch (e) {
    logger.error("Error while getting business KYC data", e);
    yield put(actions.kyc.kycUpdateIndividualRequestState(false, undefined, e.message));
  }
}

function* submitIndividualRequest(
  {
    apiKycService,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_INDIVIDUAL_REQUEST") return;
  try {
    // TODO: Add to translations
    yield neuCall(
      ensurePermissionsArePresent,
      [SUBMIT_KYC_PERMISSION],
      formatIntlMessage("kyc.modal.submit-description"),
    );
    yield put(actions.kyc.kycUpdateIndividualRequestState(true));
    const result: IHttpResponse<IKycRequestState> = yield apiKycService.submitIndividualRequest();
    yield put(actions.kyc.kycUpdateIndividualRequestState(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateIndividualRequestState(false));
    notificationCenter.error(formatIntlMessage("module.kyc.sagas.problem.submitting"));
  }
}

function* startIndividualInstantId({
  apiKycService,
  notificationCenter,
  intlWrapper: {
    intl: { formatIntlMessage },
  },
}: TGlobalDependencies): Iterator<any> {
  try {
    const result: IHttpResponse<IKycRequestState> = yield apiKycService.startInstantId();
    if (result.body.redirectUrl) window.location.replace(result.body.redirectUrl);
    yield put(actions.kyc.kycUpdateIndividualRequestState(false, result.body));
  } catch {
    notificationCenter.error(formatIntlMessage("module.kyc.sagas.problem.submitting"));
  }
}

/**
 * Company Request
 */

// legal representative
function* loadLegalRepresentative(
  { apiKycService }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_LEGAL_REPRESENTATIVE") return;
  try {
    yield put(actions.kyc.kycUpdateLegalRepresentative(true));
    const result: IHttpResponse<
      IKycLegalRepresentative
    > = yield apiKycService.getLegalRepresentative();
    yield put(actions.kyc.kycUpdateLegalRepresentative(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateLegalRepresentative(false));
  }
}

function* submitLegalRepresentative(
  {
    apiKycService,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_LEGAL_REPRESENTATIVE") return;
  try {
    yield put(actions.kyc.kycUpdateLegalRepresentative(true));
    const result: IHttpResponse<
      IKycLegalRepresentative
    > = yield apiKycService.putLegalRepresentative(action.payload.data);
    yield put(actions.kyc.kycUpdateLegalRepresentative(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateLegalRepresentative(false));
    notificationCenter.error(formatIntlMessage("module.kyc.sagas.problem-sending-data"));
  }
}

function* uploadLegalRepresentativeFile(
  {
    apiKycService,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_UPLOAD_LEGAL_REPRESENTATIVE_FILE") return;
  const { file } = action.payload;
  try {
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocument(true));
    const result: IHttpResponse<
      IKycFileInfo
    > = yield apiKycService.uploadLegalRepresentativeDocument(file);
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocument(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocument(false));
    notificationCenter.error(formatIntlMessage("module.kyc.sagas.problem-uploading"));
  }
}

function* loadLegalRepresentativeFiles(
  { apiKycService }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_LEGAL_REPRESENTATIVE_FILE_LIST") return;
  try {
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocuments(true));
    const result: IHttpResponse<
      IKycFileInfo[]
    > = yield apiKycService.getLegalRepresentativeDocuments();
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocuments(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocuments(false));
  }
}

// business data
function* setBusinessType(
  {
    apiKycService,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_SET_BUSINESS_TYPE") return;
  try {
    yield put(actions.kyc.kycUpdateBusinessData(true));
    let institutionData: IKycBusinessData = {};
    try {
      const result: IHttpResponse<IKycBusinessData> = yield apiKycService.getBusinessData();
      institutionData = result.body;
    } catch (_e) {}
    institutionData = { ...institutionData, legalFormType: action.payload.type };
    yield apiKycService.putBusinessData(institutionData);
    yield put(actions.kyc.kycUpdateBusinessData(false, institutionData));
    yield put(actions.routing.goToKYCBusinessData());
  } catch (_e) {
    yield put(actions.kyc.kycUpdateBusinessData(false));
    notificationCenter.error(formatIntlMessage("module.kyc.sagas.problem-sending-data"));
  }
}

// legal representative
function* loadBusinessData({ apiKycService }: TGlobalDependencies, action: TAction): Iterator<any> {
  if (action.type !== "KYC_LOAD_BUSINESS_DATA") return;
  try {
    yield put(actions.kyc.kycUpdateBusinessData(true));
    const result: IHttpResponse<IKycBusinessData> = yield apiKycService.getBusinessData();
    yield put(actions.kyc.kycUpdateBusinessData(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBusinessData(false));
  }
}

function* submitBusinessData(
  {
    apiKycService,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_BUSINESS_DATA") return;
  try {
    yield put(actions.kyc.kycUpdateBusinessData(true));
    const result: IHttpResponse<IKycBusinessData> = yield apiKycService.putBusinessData(
      action.payload.data,
    );
    yield put(actions.kyc.kycUpdateBusinessData(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBusinessData(false));
    notificationCenter.error(formatIntlMessage("module.kyc.sagas.problem-sending-data"));
  }
}

function* uploadBusinessFile(
  {
    apiKycService,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_UPLOAD_BUSINESS_FILE") return;
  const { file } = action.payload;
  try {
    yield put(actions.kyc.kycUpdateBusinessDocument(true));
    const result: IHttpResponse<IKycFileInfo> = yield apiKycService.uploadBusinessDocument(file);
    yield put(actions.kyc.kycUpdateBusinessDocument(false, result.body));
    notificationCenter.info(formatIntlMessage("module.kyc.sagas.successfully-uploaded"));
  } catch {
    yield put(actions.kyc.kycUpdateBusinessDocument(false));
    notificationCenter.error(formatIntlMessage("module.kyc.sagas.problem-uploading"));
  }
}

function* loadBusinessFiles(
  { apiKycService }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_BUSINESS_FILE_LIST") return;
  try {
    yield put(actions.kyc.kycUpdateBusinessDocuments(true));
    const result: IHttpResponse<IKycFileInfo[]> = yield apiKycService.getBusinessDocuments();
    yield put(actions.kyc.kycUpdateBusinessDocuments(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBusinessDocuments(false));
  }
}

// beneficial owners
function* loadBeneficialOwners(
  { apiKycService }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_BENEFICIAL_OWNERS") return;
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwners(true));
    const result: IHttpResponse<IKycBeneficialOwner[]> = yield apiKycService.getBeneficialOwners();
    yield put(actions.kyc.kycUpdateBeneficialOwners(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwners(false));
  }
}

function* createBeneficialOwner(
  {
    apiKycService,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_ADD_BENEFICIAL_OWNER") return;
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwner(true));
    const result: IHttpResponse<IKycBeneficialOwner> = yield apiKycService.postBeneficialOwner({});
    yield put(actions.kyc.kycUpdateBeneficialOwner(false, result.body.id, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwner(false));
    notificationCenter.error(formatIntlMessage("module.kyc.sagas.problem-sending-data"));
  }
}

function* submitBeneficialOwner(
  {
    apiKycService,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_BENEFICIAL_OWNER") return;
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwner(true));
    const result: IHttpResponse<IKycBeneficialOwner> = yield apiKycService.putBeneficialOwner(
      action.payload.owner,
    );
    yield put(actions.kyc.kycUpdateBeneficialOwner(false, result.body.id, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwner(false));
    notificationCenter.error(formatIntlMessage("module.kyc.sagas.problem-saving-data"));
  }
}

function* deleteBeneficalOwner(
  {
    apiKycService,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_DELETE_BENEFICIAL_OWNER") return;
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwner(true));
    yield apiKycService.deleteBeneficialOwner(action.payload.id);
    yield put(actions.kyc.kycUpdateBeneficialOwner(false, action.payload.id, undefined));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwner(false));
    notificationCenter.error(formatIntlMessage("module.kyc.sagas.problem-sending-data"));
  }
}

function* uploadBeneficialOwnerFile(
  {
    apiKycService,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_UPLOAD_BENEFICIAL_OWNER_FILE") return;
  const { boid, file } = action.payload;
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocument(boid, true));
    const result: IHttpResponse<IKycFileInfo> = yield apiKycService.uploadBeneficialOwnerDocument(
      boid,
      file,
    );
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocument(boid, false, result.body));
    notificationCenter.info(formatIntlMessage("module.kyc.sagas.successfully-uploaded"));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocument(boid, false));
    notificationCenter.error(formatIntlMessage("module.kyc.sagas.problem-uploading"));
  }
}

function* loadBeneficialOwnerFiles(
  { apiKycService }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_BENEFICIAL_OWNER_FILE_LIST") return;
  const { boid } = action.payload;
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocuments(boid, true));
    const result: IHttpResponse<IKycFileInfo[]> = yield apiKycService.getBeneficialOwnerDocuments(
      boid,
    );
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocuments(boid, false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocuments(boid, false));
  }
}

// request
function* loadBusinessRequest(
  { apiKycService, logger }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_BUSINESS_REQUEST_STATE") return;
  try {
    yield put(actions.kyc.kycUpdateBusinessRequestState(true));
    const result: IHttpResponse<IKycRequestState> = yield apiKycService.getBusinessRequest();
    yield put(actions.kyc.kycUpdateBusinessRequestState(false, result.body));
  } catch (e) {
    logger.error("Error while getting business KYC data", e);
    yield put(actions.kyc.kycUpdateBusinessRequestState(false, undefined, e.message));
  }
}

function* submitBusinessRequest(
  {
    apiKycService,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_BUSINESS_REQUEST") return;
  try {
    // check wether combined value of beneficial owners percentages is less or equal 100%
    const ownerShip = yield select((s: IAppState) => selectCombinedBeneficialOwnerOwnership(s.kyc));
    if (ownerShip > 100) {
      yield neuCall(
        displayErrorModalSaga,
        formatIntlMessage("module.kyc.sagas.error"),
        formatIntlMessage("module.kyc.sagas.beneficial-owners"),
      );
      return;
    }
    yield neuCall(
      ensurePermissionsArePresent,
      [SUBMIT_KYC_PERMISSION],
      "Confirm your Verification",
    );
    yield put(actions.kyc.kycUpdateBusinessRequestState(true));
    const result: IHttpResponse<IKycRequestState> = yield apiKycService.submitBusinessRequest();
    yield put(actions.kyc.kycUpdateBusinessRequestState(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBusinessRequestState(false));
    notificationCenter.error(formatIntlMessage("module.kyc.sagas.problem.submitting"));
  }
}

export function* loadKycRequestData(): any {
  yield put(actions.kyc.kycLoadIndividualRequest());
  yield put(actions.kyc.kycLoadBusinessRequest());

  // we block init untill both requests are done. This avoids flickering of various elements in the app.
  yield loadForOneOfTheKYCRequestsToLoad();
  yield loadForOneOfTheKYCRequestsToLoad();
}

function* loadForOneOfTheKYCRequestsToLoad(): any {
  yield take([
    (action: IAppAction) =>
      action.type === "KYC_UPDATE_INDIVIDUAL_REQUEST_STATE" &&
      !action.payload.individualRequestStateLoading,

    (action: IAppAction) =>
      action.type === "KYC_UPDATE_BUSINESS_REQUEST_STATE" &&
      !action.payload.businessRequestStateLoading,
  ]);
}

export function* kycSagas(): any {
  yield fork(neuTakeEvery, "KYC_LOAD_CLIENT_DATA", loadClientData);

  yield fork(neuTakeEvery, "KYC_LOAD_INDIVIDUAL_DATA", loadIndividualData);
  yield fork(neuTakeEvery, "KYC_SUBMIT_INDIVIDUAL_FORM", submitIndividualData);
  yield fork(neuTakeEvery, "KYC_UPLOAD_INDIVIDUAL_FILE", uploadIndividualFile);
  yield fork(neuTakeEvery, "KYC_LOAD_INDIVIDUAL_FILE_LIST", loadIndividualFiles);
  yield fork(neuTakeEvery, "KYC_START_INSTANT_ID", startIndividualInstantId);

  yield fork(neuTakeEvery, "KYC_LOAD_INDIVIDUAL_REQUEST_STATE", loadIndividualRequest);
  yield fork(neuTakeEvery, "KYC_SUBMIT_INDIVIDUAL_REQUEST", submitIndividualRequest);

  yield fork(neuTakeEvery, "KYC_LOAD_LEGAL_REPRESENTATIVE", loadLegalRepresentative);
  yield fork(neuTakeEvery, "KYC_SUBMIT_LEGAL_REPRESENTATIVE", submitLegalRepresentative);
  yield fork(neuTakeEvery, "KYC_UPLOAD_LEGAL_REPRESENTATIVE_FILE", uploadLegalRepresentativeFile);
  yield fork(neuTakeEvery, "KYC_LOAD_LEGAL_REPRESENTATIVE_FILE_LIST", loadLegalRepresentativeFiles);

  yield fork(neuTakeEvery, "KYC_SET_BUSINESS_TYPE", setBusinessType);
  yield fork(neuTakeEvery, "KYC_LOAD_BUSINESS_DATA", loadBusinessData);
  yield fork(neuTakeEvery, "KYC_SUBMIT_BUSINESS_DATA", submitBusinessData);
  yield fork(neuTakeEvery, "KYC_LOAD_LEGAL_REPRESENTATIVE_FILE_LIST", loadLegalRepresentativeFiles);
  yield fork(neuTakeEvery, "KYC_UPLOAD_BUSINESS_FILE", uploadBusinessFile);
  yield fork(neuTakeEvery, "KYC_LOAD_BUSINESS_FILE_LIST", loadBusinessFiles);

  yield fork(neuTakeEvery, "KYC_LOAD_BENEFICIAL_OWNERS", loadBeneficialOwners);
  yield fork(neuTakeEvery, "KYC_ADD_BENEFICIAL_OWNER", createBeneficialOwner);
  yield fork(neuTakeEvery, "KYC_SUBMIT_BENEFICIAL_OWNER", submitBeneficialOwner);
  yield fork(neuTakeEvery, "KYC_DELETE_BENEFICIAL_OWNER", deleteBeneficalOwner);
  yield fork(neuTakeEvery, "KYC_UPLOAD_BENEFICIAL_OWNER_FILE", uploadBeneficialOwnerFile);
  yield fork(neuTakeEvery, "KYC_LOAD_BENEFICIAL_OWNER_FILE_LIST", loadBeneficialOwnerFiles);

  yield fork(neuTakeEvery, "KYC_LOAD_BUSINESS_REQUEST_STATE", loadBusinessRequest);
  yield fork(neuTakeEvery, "KYC_SUBMIT_BUSINESS_REQUEST", submitBusinessRequest);

  yield fork(kycRefreshWidgetSagaWatcher);
  yield fork(kycRefreshWidgetSagaWatcherStop);
}
