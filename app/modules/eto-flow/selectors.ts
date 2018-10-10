import {
  EtoState,
  TCompanyEtoData,
  TPartialCompanyEtoData,
  TPartialEtoSpecData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { TEtoDocumentTemplates } from "../../lib/api/eto/EtoFileApi.interfaces";
import { IAppState } from "../../store";
import { DeepPartial } from "../../types";
import { selectIsUserEmailVerified } from "../auth/selectors";
import { selectEtoDocumentLoading } from "../eto-documents/selectors";
import { selectKycRequestStatus } from "../kyc/selectors";
import { selectEto, selectEtoWithCompanyAndContract } from "../public-etos/selectors";
import { IEtoFlowState } from "./reducer";

export const selectIssuerEtoPreviewCode = (state: IEtoFlowState) => state.etoPreviewCode;

export const selectIssuerEto = (state: IAppState) => {
  const issuerEtoPreviewCode = selectIssuerEtoPreviewCode(state.etoFlow);

  if (issuerEtoPreviewCode) {
    return selectEto(state.publicEtos, issuerEtoPreviewCode);
  }

  return undefined;
};

export const selectIssuerEtoWithCompanyAndContract = (state: IAppState) => {
  const issuerEtoPreviewCode = selectIssuerEtoPreviewCode(state.etoFlow);

  if (issuerEtoPreviewCode) {
    return selectEtoWithCompanyAndContract(state, issuerEtoPreviewCode);
  }

  return undefined;
};

export const selectIsBookBuilding = (state: IAppState): boolean | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.isBookbuilding;
  }

  return undefined;
};

export const selectCanEnableBookBuilding = (state: IAppState): boolean => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.canEnableBookbuilding;
  }

  return false;
};

export const selectIssuerEtoState = (state: IAppState): EtoState | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.state;
  }

  return undefined;
};

export const selectIssuerCompany = (state: IAppState): TCompanyEtoData | undefined => {
  const eto = selectIssuerEtoWithCompanyAndContract(state);

  if (eto) {
    return eto.company;
  }

  return undefined;
};

export const selectEtoLoading = (state: IEtoFlowState): boolean => state.loading;

export const selectCombinedEtoCompanyData = (
  state: IAppState,
): TPartialEtoSpecData & TPartialCompanyEtoData => ({
  ...selectIssuerCompany(state),
  ...selectIssuerEto(state),
});

export const selectIssuerEtoTemplates = (
  state: IAppState,
): DeepPartial<TEtoDocumentTemplates> | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.templates;
  }

  return undefined;
};

/* General Selector */

export const selectShouldEtoDataLoad = (state: IAppState) =>
  selectKycRequestStatus(state.kyc) === "Accepted" && selectIsUserEmailVerified(state.auth);

export const selectIsGeneralEtoLoading = (state: IAppState) =>
  selectEtoLoading(state.etoFlow) && selectEtoDocumentLoading(state.etoDocuments);
