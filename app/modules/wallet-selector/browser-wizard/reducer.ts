import { AppReducer } from "../../../store";

export interface IBrowserWalletWizardState {
  errorMsg?: string;
  isLoading: boolean;
  approval_rejected: boolean;
}

export const browserWalletWizardInitialState: IBrowserWalletWizardState = {
  isLoading: true,
  approval_rejected: false,
};

export const browserWalletWizardReducer: AppReducer<IBrowserWalletWizardState> = (
  state = browserWalletWizardInitialState,
  action,
): IBrowserWalletWizardState => {
  switch (action.type) {
    case "BROWSER_WALLET_CONNECTION_ERROR":
      return {
        ...state,
        errorMsg: action.payload.errorMsg,
        isLoading: false,
      };
    case "BROWSER_WALLET_APPROVAL_REJECTED":
      return {
        ...state,
        approval_rejected: true,
      };
    case "BROWSER_WALLET_APPROVAL_REQUEST_RESET":
      return {
        ...state,
        approval_rejected: false,
      };
  }

  return state;
};
