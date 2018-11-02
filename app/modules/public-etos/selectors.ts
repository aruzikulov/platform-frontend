import { find } from "lodash/fp";
import { IAppState } from "../../store";
import { IPublicEtoState } from "./reducer";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "./types";

const selectPublicEtosState = (state: IAppState) => state.publicEtos;

const selectEtoPreviewCode = (state: IPublicEtoState, etoId: string) => {
  const eto = find(eto => eto!.etoId === etoId, state.publicEtos);

  if (eto) {
    return eto.previewCode;
  }

  return undefined;
};

export const selectEto = (state: IPublicEtoState, previewCode: string) =>
  state.publicEtos[previewCode];

export const selectEtoById = (state: IPublicEtoState, etoId: string) => {
  return state.publicEtos[selectEtoPreviewCode(state, etoId)!];
};

export const selectEtoWithCompanyAndContract = (
  state: IAppState,
  previewCode: string,
): TEtoWithCompanyAndContract | undefined => {
  const publicEtosState = selectPublicEtosState(state);
  const eto = publicEtosState.publicEtos[previewCode];

  if (eto) {
    return {
      ...eto,
      company: publicEtosState.companies[eto.companyId]!,
      contract: publicEtosState.contracts[previewCode],
    };
  }

  return undefined;
};

export const selectEtoWithCompanyAndContractById = (
  state: IAppState,
  etoId: string,
): TEtoWithCompanyAndContract | undefined => {
  const publicEtosState = selectPublicEtosState(state);
  const previewCode = selectEtoPreviewCode(publicEtosState, etoId);

  if (previewCode) {
    return selectEtoWithCompanyAndContract(state, previewCode);
  }

  return undefined;
};

export const selectPublicEtos = (state: IAppState): TEtoWithCompanyAndContract[] | undefined => {
  const publicEtosState = selectPublicEtosState(state);

  if (publicEtosState.displayOrder) {
    return publicEtosState.displayOrder
      .map(id => selectEtoWithCompanyAndContract(state, id)!)
      .filter(Boolean);
  }

  return undefined;
};

export const selectEtoOnChainState = (
  state: IPublicEtoState,
  previewCode: string,
): EETOStateOnChain | undefined => {
  const contracts = state.contracts[previewCode];
  return contracts && contracts.timedState;
};

export const selectEtoOnChainStateById = (
  state: IPublicEtoState,
  etoId: string,
): EETOStateOnChain | undefined => {
  const code = selectEtoPreviewCode(state, etoId);
  if (code) {
    return state.contracts[code] && state.contracts[code].timedState;
  }
};
