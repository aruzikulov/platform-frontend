import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { ILockedWallet } from "./../wallet/reducer";

export interface IWalletMigrationData {
  smartContractAddress: string;
  migrationInputData: string;
  migrationStep: 1 | 2;
  gasLimit: string;
  value: string;
}
export interface IIcbmWalletBalanceModal {
  isOpen: boolean;
  loading: boolean;
  ethAddress?: string;
  lockedWallet?: ILockedWallet;
  walletMigrationData?: IWalletMigrationData;
}

const initialState: IIcbmWalletBalanceModal = {
  isOpen: false,
  loading: false,
};

export const icbmWalletBalanceModalReducer: AppReducer<IIcbmWalletBalanceModal> = (
  state = initialState,
  action,
): DeepReadonly<IIcbmWalletBalanceModal> => {
  switch (action.type) {
    case "ICBM_WALLET_BALANCE_MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
      };
    case "ICBM_WALLET_BALANCE_MODAL_HIDE":
      return {
        ...state,
        isOpen: false,
      };
    case "ICBM_WALLET_BALANCE_MODAL_GET_WALLET_DATA":
      return {
        ...state,
        ethAddress: action.payload.ethAddress,
        loading: true,
      };
    case "ICBM_WALLET_BALANCE_MODAL_LOAD_WALLET_DATA":
      return {
        ...state,
        loading: false,
        lockedWallet: action.payload.data,
      };
    case "ICBM_WALLET_BALANCE_MODAL_LOAD_MIGRATION_DATA":
      return {
        ...state,
        loading: false,
        walletMigrationData: action.payload.data,
      };
    default:
      return state;
  }
};
