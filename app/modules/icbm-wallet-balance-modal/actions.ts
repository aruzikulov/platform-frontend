import { createAction, createSimpleAction } from "../actionsUtils";
import { ILockedWallet } from "./../wallet/reducer";
import { IWalletMigrationData } from "./reducer";

export const icbmWalletBalanceModalActions = {
  // UX
  showIcbmWalletBalanceModal: () => createSimpleAction("ICBM_WALLET_BALANCE_MODAL_SHOW"),
  hideIcbmWalletBalanceModal: () => createSimpleAction("ICBM_WALLET_BALANCE_MODAL_HIDE"),
  // Getters
  getWalletData: (icbmWalletEthAddress: string) =>
    createAction("ICBM_WALLET_BALANCE_MODAL_GET_WALLET_DATA", { icbmWalletEthAddress }),
  //Setters
  loadIcbmWalletData: (data: ILockedWallet) =>
    createAction("ICBM_WALLET_BALANCE_MODAL_LOAD_WALLET_DATA", { data }),
  loadIcbmMigrationData: (walletMigrationData: IWalletMigrationData[]) =>
    createAction("ICBM_WALLET_BALANCE_MODAL_LOAD_MIGRATION_DATA", {
      walletMigrationData,
    }),
  setFirstTxDone: () => createSimpleAction("ICBM_WALLET_BALANCE_MODAL_FIRST_TRANSACTION_DONE"),
  setSecondTxDone: () => createSimpleAction("ICBM_WALLET_BALANCE_MODAL_SECOND_TRANSACTION_DONE"),
  setMigrationStepToNextStep: () =>
    createSimpleAction("ICBM_WALLET_BALANCE_MODAL_SET_MIGRATION_STEP_TO_NEXT"),
  // Flow
  startMigrationFlow: () => createSimpleAction("ICBM_WALLET_BALANCE_MODAL_START_MIGRATION"),
};
