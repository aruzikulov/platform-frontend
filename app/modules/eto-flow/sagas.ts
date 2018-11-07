import { effects } from "redux-saga";
import { fork, put } from "redux-saga/effects";

import { DO_BOOK_BUILDING, SUBMIT_ETO_PERMISSION } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import {
  EtoState,
  TCompanyEtoData,
  TEtoSpecsData,
  TPartialEtoSpecData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { actions, TAction } from "../actions";
import { ensurePermissionsArePresent } from "../auth/sagas";
import { loadEtoContact } from "../public-etos/sagas";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectIssuerCompany, selectIssuerEto } from "./selectors";

export function* loadIssuerEto({ apiEtoService, notificationCenter }: TGlobalDependencies): any {
  try {
    const companyResponse: IHttpResponse<TCompanyEtoData> = yield apiEtoService.getCompany();
    const company = companyResponse.body;
    const etoResponse: IHttpResponse<TEtoSpecsData> = yield apiEtoService.getMyEto();
    const eto = etoResponse.body;

    if (eto.state === EtoState.ON_CHAIN) {
      yield neuCall(loadEtoContact, eto);
    }

    yield put(actions.publicEtos.setPublicEto({ eto, company }));

    yield put(actions.etoFlow.setIssuerEtoPreviewCode(eto.previewCode));
  } catch (e) {
    notificationCenter.error(
      "Could not access ETO data. Make sure you have completed KYC and email verification process.",
    );
    yield put(actions.routing.goToDashboard());
  }
}

export function* changeBookBuildingStatus(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_CHANGE_BOOK_BUILDING_STATES") return;
  try {
    yield neuCall(
      ensurePermissionsArePresent,
      [DO_BOOK_BUILDING],
      "Confirm Changing your book building",
    );
    yield apiEtoService.changeBookBuildingState(action.payload.status);
  } catch (e) {
    logger.error("Failed to send ETO data", e);
    notificationCenter.error("Failed to send ETO data");
  } finally {
    yield put(actions.etoFlow.loadIssuerEto());
    yield put(actions.routing.goToDashboard());
  }
}

function stripEtoDataOptionalFields(data: TPartialEtoSpecData): TPartialEtoSpecData {
  // formik will pass empty strings into numeric fields that are optional, see
  // https://github.com/jaredpalmer/formik/pull/827
  // todo: we should probably enumerate Yup schema and clean up all optional numbers
  if (!data.maxTicketEur) {
    data.maxTicketEur = undefined;
  }
  return data;
}

export function* saveEtoData(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_SAVE_DATA_START") return;
  try {
    const currentCompanyData: TCompanyEtoData = yield effects.select(selectIssuerCompany);
    const currentEtoData: TEtoSpecsData = yield effects.select(selectIssuerEto);

    yield apiEtoService.putCompany({
      ...currentCompanyData,
      ...action.payload.data.companyData,
    });
    if (currentEtoData.state === EtoState.PREVIEW)
      yield apiEtoService.putMyEto(
        stripEtoDataOptionalFields({
          ...currentEtoData,
          ...action.payload.data.etoData,
        }),
      );
    yield put(actions.etoFlow.loadDataStart());
    yield put(actions.routing.goToDashboard());
  } catch (e) {
    logger.error("Failed to send ETO data", e);
    notificationCenter.error("Failed to send ETO data");
  } finally {
    yield put(actions.etoFlow.loadIssuerEto());
    yield put(actions.routing.goToDashboard());
  }
}

export function* submitEtoData(
  {
    apiEtoService,
    notificationCenter,
    logger,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_SUBMIT_DATA_START") return;
  try {
    yield neuCall(
      ensurePermissionsArePresent,
      [SUBMIT_ETO_PERMISSION],
      formatIntlMessage("eto.modal.submit-description"),
    );
    yield apiEtoService.submitCompanyAndEto();
    notificationCenter.info("ETO Successfully submitted");
  } catch (e) {
    logger.error("Failed to send ETO data", e);
    notificationCenter.error("Failed to send ETO data");
  } finally {
    yield put(actions.etoFlow.loadIssuerEto());
    yield put(actions.routing.goToDashboard());
  }
}

export function* etoFlowSagas(): any {
  yield fork(neuTakeEvery, "ETO_FLOW_LOAD_ISSUER_ETO", loadIssuerEto);
  yield fork(neuTakeEvery, "ETO_FLOW_SAVE_DATA_START", saveEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_SUBMIT_DATA_START", submitEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_CHANGE_BOOK_BUILDING_STATES", changeBookBuildingStatus);
}
