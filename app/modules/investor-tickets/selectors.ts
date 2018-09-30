import { EtoState } from "../../lib/api/eto/EtoApi.interfaces";
import { IAppState } from "../../store";
import { selectPublicEtos } from "../public-etos/selectors";
import { ETOStateOnChain } from "../public-etos/types";
import { TETOWithInvestorTicket } from "./types";

const selectInvestorTicketsState = (state: IAppState) => state.investorTickets;

export const selectInvestorTicket = (state: IAppState, etoId: string) => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.investorEtoTickets[etoId];
};

export const selectHasInvestorTicket = (state: IAppState, etoId: string) => {
  const investorState = selectInvestorTicketsState(state);

  return etoId in investorState.investorEtoTickets;
};

export const selectEtoWithInvestorTickets = (
  state: IAppState,
): TETOWithInvestorTicket[] | undefined => {
  const etos = selectPublicEtos(state);

  if (etos) {
    return etos
      .filter(eto => eto.state === EtoState.ON_CHAIN)
      .filter(eto => eto.contract!.timedState !== ETOStateOnChain.Setup)
      .filter(eto => selectHasInvestorTicket(state, eto.etoId))
      .map(eto => ({ ...eto, investorTicket: selectInvestorTicket(state, eto.etoId)! }))
      .filter(eto => !eto.investorTicket.equivEurUlps.isZero());
  }

  return undefined;
};

export const selectMyAssets = (state: IAppState): TETOWithInvestorTicket[] | undefined => {
  const etos = selectEtoWithInvestorTickets(state);

  if (etos) {
    return etos.filter(eto => eto.investorTicket.claimedOrRefunded);
  }

  return undefined;
};

export const selectMyPendingAssets = (state: IAppState): TETOWithInvestorTicket[] | undefined => {
  const etos = selectEtoWithInvestorTickets(state);

  if (etos) {
    return etos.filter(eto => !eto.investorTicket.claimedOrRefunded);
  }

  return undefined;
};
