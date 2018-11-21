import { find } from "lodash/fp";
import { IAppState } from "../../store";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "./types";

const selectPublicEtosState = (state: IAppState) => state.publicEtos;

const selectEtoPreviewCode = (state: IAppState, etoId: string) => {
  const eto = find(eto => eto!.etoId === etoId, state.publicEtos.publicEtos);

  if (eto) {
    return eto.previewCode;
  }

  return undefined;
};

export const selectPublicEto = (state: IAppState, previewCode: string) =>
  state.publicEtos.publicEtos[previewCode];

export const selectPublicEtoById = (state: IAppState, etoId: string) => {
  return state.publicEtos.publicEtos[selectEtoPreviewCode(state, etoId)!];
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
  const previewCode = selectEtoPreviewCode(state, etoId);

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
  state: IAppState,
  previewCode: string,
): EETOStateOnChain | undefined => {
  const contracts = state.publicEtos.contracts[previewCode];
  return contracts && contracts.timedState;
};

export const selectEtoOnChainStateById = (
  state: IAppState,
  etoId: string,
): EETOStateOnChain | undefined => {
  const code = selectEtoPreviewCode(state, etoId);
  if (code) return selectEtoOnChainState(state, code);
};
