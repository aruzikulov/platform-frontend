import { camelCase } from "lodash";
import { compose, keyBy, map, omit } from "lodash/fp";
import { all, fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import {
  EtoState,
  TCompanyEtoData,
  TEtoSpecsData,
  TPublicEtoData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { immutableDocumentName } from "../../lib/api/eto/EtoFileApi.interfaces";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { promisify } from "../../lib/contracts/typechain-runtime";
import { IAppState } from "../../store";
import { convertToBigInt } from "../../utils/Money.utils";
import { actions, TAction } from "../actions";
import { neuCall, neuTakeEvery } from "../sagas";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { InvalidETOStateError } from "./errors";
import { IPublicEtoState } from "./reducer";
import { selectCalculatedContributionByEtoId, selectEtoById } from "./selectors";
import {
  convertToCalculatedContribution,
  convertToEtoTotalInvestment,
  convertToStateStartDate,
} from "./utils";

export function* loadEtoPreview(
  { apiEtoService, notificationCenter }: TGlobalDependencies,
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
      yield neuCall(loadEtoContact, eto);
    }

    yield put(actions.publicEtos.setPublicEto({ eto, company }));
  } catch (e) {
    notificationCenter.error("Could not load ETO preview. Is the preview link correct?");
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadEto(
  { apiEtoService, notificationCenter }: TGlobalDependencies,
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
      yield neuCall(loadEtoContact, eto);
    }

    yield put(actions.publicEtos.setPublicEto({ eto, company }));
  } catch (e) {
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

    const timedStateRaw = yield etoContract.timedState;
    const totalInvestmentRaw = yield etoContract.totalInvestment();
    const startOfStatesRaw = yield etoContract.startOfStates;

    yield put(
      actions.publicEtos.setEtoDataFromContract(eto.previewCode, {
        timedState: timedStateRaw.toNumber(),
        totalInvestment: convertToEtoTotalInvestment(totalInvestmentRaw),
        startOfStates: convertToStateStartDate(startOfStatesRaw),
      }),
    );
  } catch (e) {
    logger.error("ETO contract data could not be loaded", e);
  }
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

    yield put(actions.publicEtos.setPublicEtos({ etos: etosByPreviewCode, companies }));
    yield put(actions.publicEtos.setEtosDisplayOrder(order));
  } catch (e) {
    logger.error("ETOs could not be loaded", e);
  }
}

export function* loadComputedContributionFromContract(
  { contractsService }: TGlobalDependencies,
  eto: TPublicEtoData,
  amountEuroUlps?: string,
  isICBM = false,
): any {
  if (eto.state !== "on_chain") return;

  const state: IAppState = yield select();
  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);

  if (etoContract) {
    amountEuroUlps =
      amountEuroUlps || convertToBigInt((eto.minTicketEur && eto.minTicketEur.toString()) || "0");

    const from = selectEthereumAddressWithChecksum(state.web3);
    // sorry no typechain, typechain has a bug with boolean casting
    const calculation = yield promisify(etoContract.rawWeb3Contract.calculateContribution, [
      from,
      isICBM,
      amountEuroUlps,
    ]);
    yield put(
      actions.publicEtos.setCalculatedContribution(
        eto.previewCode,
        convertToCalculatedContribution(calculation),
      ),
    );
  }
}

function* loadCalculatedContribution(_: TGlobalDependencies, action: TAction): any {
  if (action.type !== "PUBLIC_ETOS_LOAD_CALCULATED_CONTRIBUTION") return;
  const state: IPublicEtoState = yield select((s: IAppState) => s.publicEtos);
  const eto = selectEtoById(state, action.payload.etoId);
  if (!eto) return;
  const contribution = selectCalculatedContributionByEtoId(eto.etoId, state);
  if (!contribution || action.payload.investmentEurUlps) {
    yield neuCall(loadComputedContributionFromContract, eto, action.payload.investmentEurUlps);
  }
}

function* downloadDocumentByType(_: TGlobalDependencies, action: TAction): any {
  if (action.type !== "PUBLIC_ETOS_DOWNLOAD_DOCUMENT_BY_TYPE") return;
  const state: IAppState = yield select();
  const eto = selectEtoById(state.publicEtos, action.payload.etoId);
  if (eto) {
    const document = eto.templates[camelCase(action.payload.documentType)];
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
}

export function* etoSagas(): any {
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETO_PREVIEW", loadEtoPreview);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETO", loadEto);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETOS", loadEtos);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_CALCULATED_CONTRIBUTION", loadCalculatedContribution);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_DOWNLOAD_DOCUMENT_BY_TYPE", downloadDocumentByType);
}
