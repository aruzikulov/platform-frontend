import { addBigNumbers } from "../../utils/BigNumberUtils";
import { ILockedWallet } from "../wallet/reducer";
import { IIcbmWalletBalanceModal, IWalletMigrationData } from "./reducer";

export const selectIcbmWalletEthAddress = (state: IIcbmWalletBalanceModal): string | undefined =>
  state.ethAddress;

export const selectIcbmMigrationWallet = (
  state: IIcbmWalletBalanceModal,
): ILockedWallet | undefined => state.lockedWallet;

export const selectEtherNeumarksDueIcbmModal = (state: IIcbmWalletBalanceModal): string =>
  (state.lockedWallet && state.lockedWallet.neumarksDue) || "0";

export const selectEurNeumarksDueIcbmModal = (state: IIcbmWalletBalanceModal): string =>
  (state.lockedWallet && state.lockedWallet.neumarksDue) || "0";

export const selectAllNeumakrsDueIcbmModal = (state: IIcbmWalletBalanceModal): string =>
  addBigNumbers([selectEtherNeumarksDueIcbmModal(state), selectEurNeumarksDueIcbmModal(state)]);

export const selectEtherBalanceIcbmModal = (state: IIcbmWalletBalanceModal): string =>
  (state.lockedWallet && state.lockedWallet.LockedBalance) || "0";

export const selectIcbmWalletConnectedIcbmModal = (state: IIcbmWalletBalanceModal): boolean =>
  !!(state.lockedWallet && state.lockedWallet.unlockDate !== "0");

export const selectWalletMigrationData = (
  state: IIcbmWalletBalanceModal,
): IWalletMigrationData | undefined => state.walletMigrationData;
