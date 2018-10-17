import { TCompanyEtoData, TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { IEtoContractData } from "./types";

export interface IPublicEtoState {
  publicEtos: { [previewCode: string]: TEtoSpecsData | undefined };
  companies: { [companyId: string]: TCompanyEtoData | undefined };
  contracts: { [previewCode: string]: IEtoContractData };
  displayOrder: string[] | undefined;
}

export const etoFlowInitialState: IPublicEtoState = {
  publicEtos: {},
  companies: {},
  contracts: {},
  displayOrder: undefined,
};

export const publicEtosReducer: AppReducer<IPublicEtoState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IPublicEtoState> => {
  switch (action.type) {
    case "PUBLIC_ETOS_SET_PUBLIC_ETOS":
      return {
        ...state,
        publicEtos: {
          ...state.publicEtos,
          ...action.payload.etos,
        },
        companies: {
          ...state.companies,
          ...action.payload.companies,
        },
      };
    case "PUBLIC_ETOS_SET_PUBLIC_ETO":
      return {
        ...state,
        publicEtos: {
          ...state.publicEtos,
          [action.payload.eto.previewCode]: action.payload.eto,
        },
        companies: {
          ...state.companies,
          [action.payload.company.companyId]: action.payload.company,
        },
      };
    case "PUBLIC_ETOS_SET_DISPLAY_ORDER":
      return {
        ...state,
        displayOrder: action.payload.order,
      };
    case "PUBLIC_ETOS_SET_ETO_DATA_FROM_CONTRACT":
      return {
        ...state,
        contracts: {
          ...state.contracts,
          [action.payload.previewCode]: action.payload.data,
        },
      };
  }

  return state;
};
