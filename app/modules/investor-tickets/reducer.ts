import { AppReducer } from "../../store";
import { DeepReadonly, Dictionary } from "../../types";
import { ICalculatedContribution, IInvestorTicket } from "./types";

export interface IInvestorTicketsState {
  investorEtoTickets: Dictionary<IInvestorTicket | undefined>;
  calculatedContributions: Dictionary<ICalculatedContribution | undefined>;
}

export const etoFlowInitialState: IInvestorTicketsState = {
  calculatedContributions: {},
  investorEtoTickets: {},
};

export const investorTicketsReducer: AppReducer<IInvestorTicketsState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IInvestorTicketsState> => {
  switch (action.type) {
    case "INVESTOR_TICKET_SET":
      return {
        ...state,
        investorEtoTickets: {
          ...state.investorEtoTickets,
          [action.payload.etoId]: action.payload.ticket,
        },
      };
    case "INVESTOR_TICKET_SET_CALCULATED_CONTRIBUTION":
      return {
        ...state,
        calculatedContributions: {
          ...state.calculatedContributions,
          [action.payload.etoId]: action.payload.contribution,
        },
      };
  }

  return state;
};
