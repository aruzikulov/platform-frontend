import { EEtoFormTypes } from "../../../modules/eto-flow/types";
import { EtoState } from "./EtoApi.interfaces";

export const etoFormIsReadonly = (formName: EEtoFormTypes, etoState?: EtoState) => {
  const readOnlyForms = [
    EEtoFormTypes.EtoEquityTokenInfo,
    EEtoFormTypes.EtoTerms,
    EEtoFormTypes.EtoVotingRights,
    EEtoFormTypes.EtoInvestmentTerms,
  ];
  return etoState !== EtoState.PREVIEW && readOnlyForms.includes(formName);
};
