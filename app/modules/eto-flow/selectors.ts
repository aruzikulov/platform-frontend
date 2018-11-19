import {
  EtoState,
  TCompanyEtoData,
  TPartialCompanyEtoData,
  TPartialEtoSpecData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { TEtoDocumentTemplates } from "../../lib/api/eto/EtoFileApi.interfaces";
import { IAppState } from "../../store";
import { selectIsUserEmailVerified } from "../auth/selectors";
import { selectEtoDocumentLoading } from "../eto-documents/selectors";
import { selectKycRequestStatus } from "../kyc/selectors";
import { selectEtoWithCompanyAndContract, selectPublicEto } from "../public-etos/selectors";

export const selectIssuerEtoPreviewCode = (state: IAppState) => state.etoFlow.etoPreviewCode;

export const selectIssuerEto = (state: IAppState) => {
  const issuerEtoPreviewCode = selectIssuerEtoPreviewCode(state);

  if (issuerEtoPreviewCode) {
    return selectPublicEto(state, issuerEtoPreviewCode);
  }

  return undefined;
};

export const selectIssuerEtoWithCompanyAndContract = (state: IAppState) => {
  const issuerEtoPreviewCode = selectIssuerEtoPreviewCode(state);

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

export const selectIssuerEtoIsRetail = (state: IAppState): boolean => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.allowRetailInvestors;
  }

  return false;
};

export const selectIssuerCompany = (state: IAppState): TCompanyEtoData | undefined => {
  const eto = selectIssuerEtoWithCompanyAndContract(state);

  if (eto) {
    return eto.company;
  }

  return undefined;
};

export const selectIssuerEtoLoading = (state: IAppState): boolean => state.etoFlow.loading;

export const selectCombinedEtoCompanyData = (
  state: IAppState,
): TPartialEtoSpecData & TPartialCompanyEtoData => ({
  ...selectIssuerCompany(state),
  ...selectIssuerEto(state),
});

export const selectIssuerEtoTemplates = (state: IAppState): TEtoDocumentTemplates | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.templates;
  }

  return undefined;
};

export const selectIssuerEtoDocuments = (state: IAppState): TEtoDocumentTemplates | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.documents;
  }

  return undefined;
};

export const selectIsTermSheetSubmitted = (state: IAppState): boolean | undefined => {
  const documents = selectIssuerEtoDocuments(state);

  if (documents) {
    return Object.keys(documents).some(key => documents[key].documentType === "signed_termsheet");
  }
  return undefined;
};

export const selectIsOfferingDocumentSubmitted = (state: IAppState): boolean | undefined => {
  const documents = selectIssuerEtoDocuments(state);

  if (documents) {
    return Object.keys(documents).some(
      key => documents[key].documentType === "approved_investor_offering_document",
    );
  }
  return undefined;
};

/* General Selector */

export const selectShouldEtoDataLoad = (state: IAppState) =>
  selectKycRequestStatus(state.kyc) === "Accepted" && selectIsUserEmailVerified(state.auth);

export const selectIsGeneralEtoLoading = (state: IAppState) =>
  selectIssuerEtoLoading(state) && selectEtoDocumentLoading(state.etoDocuments);
