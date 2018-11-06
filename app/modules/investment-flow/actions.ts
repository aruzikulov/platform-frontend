import { createAction, createSimpleAction } from "../actionsUtils";
import { ETxSenderType } from "../tx/interfaces";
import {
  EBankTransferFlowState,
  EInvestmentCurrency,
  EInvestmentErrorState,
  EInvestmentType,
} from "./reducer";

export const investmentFlowActions = {
  // public actions
  startInvestment: (etoId: string) => createAction("INVESTMENT_FLOW_START", { etoId }),
  resetInvestment: () => createSimpleAction("INVESTMENT_FLOW_RESET"),
  selectInvestmentType: (type?: EInvestmentType) =>
    createAction("INVESTMENT_FLOW_SELECT_INVESTMENT_TYPE", { type }),
  submitCurrencyValue: (value: string, currency: EInvestmentCurrency) =>
    createAction("INVESTMENT_FLOW_SUBMIT_INVESTMENT_VALUE", { value, currency }),
  investEntireBalance: () => createSimpleAction("INVESTMENT_FLOW_INVEST_ENTIRE_BALANCE"),
  validateInputs: () => createSimpleAction("INVESTMENT_FLOW_VALIDATE_INPUTS"),
  showBankTransferDetails: () => createSimpleAction("INVESTMENT_FLOW_SHOW_BANK_TRANSFER_DETAILS"),
  showBankTransferSummary: () => createSimpleAction("INVESTMENT_FLOW_SHOW_BANK_TRANSFER_SUMMARY"),
  changeBankTransfer: (type: ETxSenderType) =>
    createAction("INVESTMENT_FLOW_BANK_TRANSFER_CHANGE", { type }),
  toggleBankTransferGasStipend: () =>
    createSimpleAction("INVESTMENT_FLOW_TOGGLE_BANK_TRANSFER_GAS_STIPEND"),
  // state mutations
  setEtoId: (etoId: string) => createAction("INVESTMENT_FLOW_SET_ETO_ID", { etoId }),
  setEthValue: (value: string) =>
    createAction("INVESTMENT_FLOW_SET_INVESTMENT_ETH_VALUE", { value }),
  setEurValue: (value: string) =>
    createAction("INVESTMENT_FLOW_SET_INVESTMENT_EUR_VALUE", { value }),
  setErrorState: (errorState?: EInvestmentErrorState) =>
    createAction("INVESTMENT_FLOW_SET_INVESTMENT_ERROR_STATE", { errorState }),
  setIsInputValidated: (isValidated: boolean) =>
    createAction("INVESTMENT_FLOW_SET_IS_INPUT_VALIDATED", { isValidated }),
  setBankTransferFlowState: (state: EBankTransferFlowState) =>
    createAction("INVESTMENT_FLOW_SET_BANK_TRANSFER_FLOW_STATE", { state }),
  setActiveInvestmentTypes: (activeInvestmentTypes: EInvestmentType[]) =>
    createAction("INVESTMENT_FLOW_SET_ACTIVE_INVESTMENT_TYPES", { activeInvestmentTypes }),
};
