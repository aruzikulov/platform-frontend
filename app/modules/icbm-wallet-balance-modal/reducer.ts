import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { ILockedWallet } from "./../wallet/reducer";

export type TWalletMigrationSteps = 1 | 2;
export interface IWalletMigrationData {
  smartContractAddress: string;
  migrationInputData: string;
  gasLimit: string;
  value: string;
}
export interface IIcbmWalletBalanceModal {
  isOpen: boolean;
  loading: boolean;
  icbmWalletEthAddress?: string;
  lockedWallet?: ILockedWallet;
  walletMigrationData?: IWalletMigrationData[];
  currentMigrationStep: TWalletMigrationSteps;
  isMigrating: boolean;
  firstTransactionDone: boolean;
  secondTransactionDone: boolean;
}

const initialState: IIcbmWalletBalanceModal = {
  isOpen: false,
  loading: false,
  isMigrating: false,
  firstTransactionDone: false,
  secondTransactionDone: false,
  currentMigrationStep: 1,
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
        icbmWalletEthAddress: action.payload.icbmWalletEthAddress,
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
        walletMigrationData: action.payload.walletMigrationData,
      };
    case "ICBM_WALLET_BALANCE_MODAL_START_MIGRATION":
      return {
        ...state,
        isMigrating: true,
      };
    case "ICBM_WALLET_BALANCE_MODAL_FIRST_TRANSACTION_DONE":
      return {
        ...state,
        firstTransactionDone: true,
      };
    case "ICBM_WALLET_BALANCE_MODAL_SECOND_TRANSACTION_DONE":
      return {
        ...state,
        secondTransactionDone: true,
      };
    case "ICBM_WALLET_BALANCE_MODAL_SET_MIGRATION_STEP_TO_NEXT":
      return {
        ...state,
        currentMigrationStep: 2,
      };
    default:
      return state;
  }
};
