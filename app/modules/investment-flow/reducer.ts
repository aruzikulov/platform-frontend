import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { multiplyBigNumbers } from "../../utils/BigNumberUtils";

const INVESTMENT_GAS_AMOUNT = "600000";
const GAS_PRICE_MULTIPLIER = 1.2;

export enum EInvestmentType {
  InvestmentWallet = "INVESTMENT_WALLET",
  ICBMEth = "ICBM_ETH",
  ICBMnEuro = "ICBM_NEURO",
  BankTransfer = "BANK_TRANSFER",
}

export enum EInvestmentCurrency {
  Ether = "ETH",
  Euro = "EUR",
}

export enum EInvestmentErrorState {
  AboveMaximumTicketSize = "above_maximum_ticket_size",
  BelowMinimumTicketSize = "below_minimum_ticket_size",
  ExceedsWalletBalance = "exceeds_wallet_balance",
  ExceedsTokenAmount = "exceeds_token_amount",
  NotEnoughEtherForGas = "not_enough_ether_for_gas",
}

export enum EBankTransferFlowState {
  Details = "details",
  Summary = "summary",
}

export interface IInvestmentFlowState {
  etoId: string;
  euroValueUlps: string;
  ethValueUlps: string;
  investmentType: EInvestmentType;
  errorState?: EInvestmentErrorState;
  gasAmount: string;
  gasPrice: string;
  isValidatedInput: boolean;
  bankTransferFlowState?: EBankTransferFlowState;
  bankTransferGasStipend?: boolean;
}

export const investmentFlowInitialState: IInvestmentFlowState = {
  etoId: "",
  euroValueUlps: "",
  ethValueUlps: "",
  investmentType: EInvestmentType.InvestmentWallet,
  gasAmount: INVESTMENT_GAS_AMOUNT,
  gasPrice: "0",
  isValidatedInput: false,
};

export const investmentFlowReducer: AppReducer<IInvestmentFlowState> = (
  state = investmentFlowInitialState,
  action,
): DeepReadonly<IInvestmentFlowState> => {
  switch (action.type) {
    case "INVESTMENT_FLOW_RESET":
      return {
        ...investmentFlowInitialState,
      };
    case "INVESTMENT_FLOW_SELECT_INVESTMENT_TYPE":
      return {
        ...investmentFlowInitialState,
        etoId: state.etoId,
        gasPrice: state.gasPrice,
        investmentType: action.payload.type,
      };
    case "INVESTMENT_FLOW_SET_ETO_ID":
      return {
        ...state,
        etoId: action.payload.etoId,
      };
    case "INVESTMENT_FLOW_SET_GAS_PRICE":
      return {
        ...state,
        gasPrice: multiplyBigNumbers([action.payload.gasPrice || 0, GAS_PRICE_MULTIPLIER]),
      };
    case "INVESTMENT_FLOW_SET_INVESTMENT_ERROR_STATE":
      return {
        ...state,
        errorState: action.payload.errorState,
      };
    case "INVESTMENT_FLOW_SET_INVESTMENT_ETH_VALUE":
      return {
        ...state,
        ethValueUlps: action.payload.value,
      };
    case "INVESTMENT_FLOW_SET_INVESTMENT_EUR_VALUE":
      return {
        ...state,
        euroValueUlps: action.payload.value,
      };
    case "INVESTMENT_FLOW_SET_IS_INPUT_VALIDATED":
      return {
        ...state,
        isValidatedInput: action.payload.isValidated,
      };
    case "INVESTMENT_FLOW_SET_BANK_TRANSFER_FLOW_STATE":
      return {
        ...state,
        bankTransferFlowState: action.payload.state,
      };
    case "INVESTMENT_FLOW_TOGGLE_BANK_TRANSFER_GAS_STIPEND":
      return {
        ...state,
        bankTransferGasStipend: !state.bankTransferGasStipend,
      };
  }

  return state;
};
