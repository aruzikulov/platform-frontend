import { createAction, createSimpleAction } from "../actionsUtils";

export const accessWalletActions = {
  showAccessWalletModal: (title: string, message: string) =>
    createAction("SHOW_ACCESS_WALLET_MODAL", { title, message }),
  hideAccessWalletModal: () => createSimpleAction("HIDE_ACCESS_WALLET_MODAL"),
  signingError: (errorMsg: string) => createAction("ACCESS_WALLET_SIGNING_ERROR", { errorMsg }),
  clearSigningError: () => createSimpleAction("ACCESS_WALLET_CLEAR_SIGNING_ERROR"),
  accept: (password?: string) => createAction("ACCESS_WALLET_ACCEPT", { password }),
};
