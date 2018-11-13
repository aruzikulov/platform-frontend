import { camelCase } from "lodash";
import { compose, keyBy, map, omit } from "lodash/fp";
import { LOCATION_CHANGE } from "react-router-redux";
import { delay } from "redux-saga";
import { all, fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import {
  EtoState,
  TCompanyEtoData,
  TEtoSpecsData,
  TPublicEtoData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { IEtoDocument, immutableDocumentName } from "../../lib/api/eto/EtoFileApi.interfaces";
import { EUserType } from "../../lib/api/users/interfaces";
import { EtherToken } from "../../lib/contracts/EtherToken";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { EuroToken } from "../../lib/contracts/EuroToken";
import { IAppState } from "../../store";
import { actions, TAction } from "../actions";
import { selectUserType } from "../auth/selectors";
import { neuCall, neuFork, neuTakeEvery, neuTakeUntil } from "../sagasUtils";
import { etoInProgressPoolingDelay, etoNormalPoolingDelay } from "./constants";
import { InvalidETOStateError } from "./errors";
import { selectEtoById, selectEtoWithCompanyAndContract } from "./selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "./types";
import { convertToEtoTotalInvestment, convertToStateStartDate } from "./utils";

export function* loadEtoPreview(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "PUBLIC_ETOS_LOAD_ETO_PREVIEW") return;
  const previewCode = action.payload.previewCode;

  try {
    const etoResponse: IHttpResponse<TEtoSpecsData> = yield apiEtoService.getEtoPreview(
      previewCode,
    );
    const eto = etoResponse.body;
    const companyResponse: IHttpResponse<TCompanyEtoData> = yield apiEtoService.getCompanyById(
      eto.companyId,
    );
    const company = companyResponse.body;

    // Load contract data if eto is already on blockchain
    if (eto.state === EtoState.ON_CHAIN) {
      // load investor tickets
      const userType: EUserType | undefined = yield select((state: IAppState) =>
        selectUserType(state.auth),
      );
      if (userType === EUserType.INVESTOR) {
        yield put(actions.investorEtoTicket.loadEtoInvestorTicket(eto));
      }

      yield neuCall(loadEtoContact, eto);
    }

    yield put(actions.publicEtos.setPublicEto({ eto, company }));
  } catch (e) {
    logger.error("Could not load eto by preview code", e);

    notificationCenter.error("Could not load ETO preview. Is the preview link correct?");
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadEto(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "PUBLIC_ETOS_LOAD_ETO") return;

  try {
    const etoId = action.payload.etoId;

    const etoResponse: IHttpResponse<TEtoSpecsData> = yield apiEtoService.getEto(etoId);
    const eto = etoResponse.body;

    const companyResponse: IHttpResponse<TCompanyEtoData> = yield apiEtoService.getCompanyById(
      eto.companyId,
    );
    const company = companyResponse.body;

    // Load contract data if eto is already on blockchain
    if (eto.state === EtoState.ON_CHAIN) {
      // load investor tickets
      const userType: EUserType | undefined = yield select((state: IAppState) =>
        selectUserType(state.auth),
      );
      if (userType === EUserType.INVESTOR) {
        yield put(actions.investorEtoTicket.loadEtoInvestorTicket(eto));
      }

      yield neuCall(loadEtoContact, eto);
    }

    yield put(actions.publicEtos.setPublicEto({ eto, company }));
  } catch (e) {
    logger.error("Could not load eto by id", e);

    notificationCenter.error("Could not load ETO. Is the link correct?");

    yield put(actions.routing.goToDashboard());
  }
}

export function* loadEtoContact(
  { contractsService, logger }: TGlobalDependencies,
  eto: TPublicEtoData,
): any {
  try {
    if (eto.state !== EtoState.ON_CHAIN) {
      logger.error(new InvalidETOStateError(eto.state, EtoState.ON_CHAIN));
      return;
    }

    const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);
    const etherTokenContract: EtherToken = contractsService.etherToken;
    const euroTokenContract: EuroToken = contractsService.euroToken;

    const etherTokenBalance = yield etherTokenContract.balanceOf(etoContract.address);
    const euroTokenBalance = yield euroTokenContract.balanceOf(etoContract.address);
    const timedStateRaw = yield etoContract.timedState;
    const totalInvestmentRaw = yield etoContract.totalInvestment();
    const startOfStatesRaw = yield etoContract.startOfStates;

    yield put(
      actions.publicEtos.setEtoDataFromContract(eto.previewCode, {
        timedState: timedStateRaw.toNumber(),
        totalInvestment: convertToEtoTotalInvestment(
          totalInvestmentRaw,
          euroTokenBalance,
          etherTokenBalance,
        ),
        startOfStates: convertToStateStartDate(startOfStatesRaw),
      }),
    );
  } catch (e) {
    logger.error("ETO contract data could not be loaded", e);
  }
}

function* watchEtoSetAction(_: TGlobalDependencies, action: TAction): any {
  if (action.type !== "PUBLIC_ETOS_SET_PUBLIC_ETO") return;

  const previewCode = action.payload.eto.previewCode;

  yield neuCall(watchEto, previewCode);
}

function* watchEtosSetAction(_: TGlobalDependencies, action: TAction): any {
  if (action.type !== "PUBLIC_ETOS_SET_PUBLIC_ETOS") return;

  yield all(map(eto => neuFork(watchEto, eto.previewCode), action.payload.etos));
}

function* watchEto(_: TGlobalDependencies, previewCode: string): any {
  const eto: TEtoWithCompanyAndContract = yield select((state: IAppState) =>
    selectEtoWithCompanyAndContract(state, previewCode),
  );

  if (
    eto.state === EtoState.ON_CHAIN &&
    [EETOStateOnChain.Whitelist, EETOStateOnChain.Public].includes(eto.contract!.timedState)
  ) {
    yield delay(etoInProgressPoolingDelay);
  } else {
    yield delay(etoNormalPoolingDelay);
  }

  yield put(actions.publicEtos.loadEtoPreview(previewCode));
}

function* loadEtos({ apiEtoService, logger }: TGlobalDependencies): any {
  try {
    const etosResponse: IHttpResponse<TPublicEtoData[]> = yield apiEtoService.getEtos();
    const etos = etosResponse.body;

    const companies = compose(
      keyBy((eto: TCompanyEtoData) => eto.companyId),
      map((eto: TPublicEtoData) => eto.company),
    )(etos);

    const etosByPreviewCode = compose(
      keyBy((eto: TEtoSpecsData) => eto.previewCode),
      // remove company prop from eto
      // it's saved separately for consistency with other endpoints
      map(omit("company")),
    )(etos);

    const order = etosResponse.body.map(eto => eto.previewCode);

    yield all(
      order
        .map(id => etosByPreviewCode[id])
        .filter(eto => eto.state === EtoState.ON_CHAIN)
        .map(eto => neuCall(loadEtoContact, eto)),
    );

    // load investor tickets
    const userType: EUserType | undefined = yield select((state: IAppState) =>
      selectUserType(state.auth),
    );
    if (userType === EUserType.INVESTOR) {
      yield put(actions.investorEtoTicket.loadInvestorTickets(etosByPreviewCode));
    }

    yield put(actions.publicEtos.setPublicEtos({ etos: etosByPreviewCode, companies }));
    yield put(actions.publicEtos.setEtosDisplayOrder(order));
  } catch (e) {
    logger.error("ETOs could not be loaded", e);
  }
}

function* download(document: IEtoDocument): any {
  if (document) {
    yield put(
      actions.immutableStorage.downloadImmutableFile(
        {
          ipfsHash: document.ipfsHash,
          mimeType: document.mimeType,
          asPdf: true,
        },
        immutableDocumentName[document.documentType],
      ),
    );
  }
}

function* downloadDocument(_: TGlobalDependencies, action: TAction): any {
  if (action.type !== "PUBLIC_ETOS_DOWNLOAD_DOCUMENT") return;

  yield download(action.payload.document);
}

function* downloadTemplateByType(_: TGlobalDependencies, action: TAction): any {
  if (action.type !== "PUBLIC_ETOS_DOWNLOAD_TEMPLATE_BY_TYPE") return;
  const state: IAppState = yield select();
  const eto = selectEtoById(state.publicEtos, action.payload.etoId);
  if (eto) {
    yield download(eto.templates[camelCase(action.payload.documentType)]);
  }
}

export function* etoSagas(): any {
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETO_PREVIEW", loadEtoPreview);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETO", loadEto);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETOS", loadEtos);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_DOWNLOAD_DOCUMENT", downloadDocument);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_DOWNLOAD_TEMPLATE_BY_TYPE", downloadTemplateByType);
  yield fork(neuTakeUntil, "PUBLIC_ETOS_SET_PUBLIC_ETO", LOCATION_CHANGE, watchEtoSetAction);
  yield fork(neuTakeUntil, "PUBLIC_ETOS_SET_PUBLIC_ETOS", LOCATION_CHANGE, watchEtosSetAction);
}
