import { EtoState } from "../../lib/api/eto/EtoApi.interfaces";
import { IAppState } from "../../store";
import { selectPublicEtos } from "../public-etos/selectors";
import { EETOStateOnChain } from "../public-etos/types";
import { selectLockedWalletConnected } from "../wallet/selectors";
import { ICalculatedContribution, TETOWithInvestorTicket } from "./types";

const selectInvestorTicketsState = (state: IAppState) => state.investorTickets;

export const selectInvestorTicket = (state: IAppState, etoId: string) => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.investorEtoTickets[etoId];
};

export const selectHasInvestorTicket = (state: IAppState, etoId: string) => {
  const investorState = selectInvestorTicketsState(state);

  const investmentTicket = investorState.investorEtoTickets[etoId];

  if (investmentTicket) {
    // equivEurUlps is set to zero when investor didn't invest
    return !investmentTicket.equivEurUlps.isZero();
  }

  return false;
};

export const selectEtoWithInvestorTickets = (
  state: IAppState,
): TETOWithInvestorTicket[] | undefined => {
  const etos = selectPublicEtos(state);

  if (etos) {
    return etos
      .filter(eto => eto.state === EtoState.ON_CHAIN)
      .filter(eto => eto.contract!.timedState !== EETOStateOnChain.Setup)
      .filter(eto => selectHasInvestorTicket(state, eto.etoId))
      .map(eto => ({
        ...eto,
        investorTicket: selectInvestorTicket(state, eto.etoId)!,
      }));
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

export const selectCalculatedContribution = (etoId: string, state: IAppState) => {
  const investorState = selectInvestorTicketsState(state);

  return (
    investorState.calculatedContributions[etoId] ||
    selectInitialCalculatedContribution(etoId, state)
  );
};

export const selectInitialCalculatedContribution = (
  etoId: string,
  state: IAppState,
): ICalculatedContribution | undefined => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.initialCalculatedContributions[etoId];
};

export const selectInitialMaxCapExceeded = (etoId: string, state: IAppState): boolean => {
  const initialCalculatedContribution = selectInitialCalculatedContribution(etoId, state);

  if (!initialCalculatedContribution) return false;

  return initialCalculatedContribution.maxCapExceeded;
};

export const selectEquityTokenCountByEtoId = (etoId: string, state: IAppState) => {
  const contrib = selectCalculatedContribution(etoId, state);
  return contrib && contrib.equityTokenInt.toString();
};

export const selectEtoTicketSizesById = (etoId: string, state: IAppState) => {
  const contrib = selectCalculatedContribution(etoId, state);
  return (
    contrib && {
      minTicketEurUlps: contrib.minTicketEurUlps,
      maxTicketEurUlps: contrib.maxTicketEurUlps,
    }
  );
};

export const selectNeuRewardUlpsByEtoId = (etoId: string, state: IAppState) => {
  const contrib = selectCalculatedContribution(etoId, state);
  return contrib && contrib.neuRewardUlps.toString();
};

export const selectIsWhitelisted = (etoId: string, state: IAppState) => {
  const contrib = selectCalculatedContribution(etoId, state);
  return !!contrib && contrib.isWhitelisted;
};

export const selectIsEligibleToPreEto = (etoId: string, state: IAppState) => {
  const isLockedWalletConnected = selectLockedWalletConnected(state);
  const isWhitelisted = selectIsWhitelisted(etoId, state);
  return isLockedWalletConnected || isWhitelisted;
};
