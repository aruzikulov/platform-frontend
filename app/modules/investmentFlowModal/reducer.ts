import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export enum EInvestmentType {
  None = "NONE",
  InvestmentWallet = "INVESTMENT_WALLET",
  ICBMEth = "ICBM_ETH",
  ICBMnEuro = "ICBM_NEURO",
  BankTransfer = "BANK_TRANSFER"
}

export enum EInvestmentErrorState {
  AboveMaximumTicketSize = "above_maximum_ticket_size",
  BelowMinimumTicketSize = "below_minimum_ticket_size",
  ExceedsWalletBalance = "exceeds_wallet_balance",
  ExceedsTokenAmount = "exceeds_token_amount",
}

export interface IInvestmentFlowState {
  euroValue: string,
  investmentType: EInvestmentType
  errorState?: EInvestmentErrorState
}

export const investmentFlowInitialState: IInvestmentFlowState = {
  euroValue: "",
  investmentType: EInvestmentType.None
};

export const investmentFlowModalReducer: AppReducer<IInvestmentFlowState> = (
  state = investmentFlowInitialState,
  action,
): DeepReadonly<IInvestmentFlowState> => {
  switch (action.type) {
    case "INVESTMENT_FLOW_SELECT_INVESTMENT_TYPE":
      return {
        ...state,
        investmentType: action.payload.type
      };
  }

  return state;
};
