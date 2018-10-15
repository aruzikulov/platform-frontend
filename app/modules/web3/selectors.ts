import * as queryString from "query-string";
import { RouterState } from "react-router-redux";
import { createSelector } from "reselect";
import { TWalletMetadata } from "../../lib/persistence/WalletMetadataObjectStorage";
import { EthereumAddress } from "../../types";
import { IConnectedWeb3State, IWeb3State } from "./reducer";
import { EWalletSubType, EWalletType } from "./types";
import { makeEthereumAddressChecksummed } from "./utils";

export const selectConnectedWeb3State = (state: IWeb3State): IConnectedWeb3State => {
  if (!state.connected) {
    throw Error("Wallet not connected");
  }
  return state;
};

const selectEthereumAddress = (state: IWeb3State): EthereumAddress =>
  state.connected ? state.wallet.address : state.previousConnectedWallet!.address;

export const selectEthereumAddressWithChecksum = createSelector(selectEthereumAddress, address => {
  return makeEthereumAddressChecksummed(address);
});

export const selectSeed = (state: IWeb3State): string[] | undefined => {
  return (state.connected && state.seed && state.seed.split(" ")) || undefined;
};

export const isLightWalletReadyToLogin = (state: IWeb3State): boolean =>
  !!(
    !state.connected &&
    state.previousConnectedWallet &&
    state.previousConnectedWallet.walletType === EWalletType.LIGHT &&
    state.previousConnectedWallet.email &&
    state.previousConnectedWallet.salt &&
    state.previousConnectedWallet.vault
  );

/**
 * Works both when wallet is connected or not.
 */
export const selectIsLightWallet = (state: IWeb3State): boolean => {
  return (
    (state.connected && state.wallet.walletType === EWalletType.LIGHT) ||
    isLightWalletReadyToLogin(state)
  );
};

export const selectWalletSubType = (state: IWeb3State): EWalletSubType | undefined =>
  state.connected
    ? (state.wallet.walletType === EWalletType.BROWSER && state.wallet.walletSubType) || undefined
    : (state.previousConnectedWallet &&
        (state.previousConnectedWallet.walletType === EWalletType.BROWSER &&
          state.previousConnectedWallet.walletSubType)) ||
      undefined;

export const selectWalletType = (state: IWeb3State): EWalletType | undefined =>
  state.connected
    ? state.wallet.walletType
    : state.previousConnectedWallet && state.previousConnectedWallet.walletType;

export const selectLightWalletSalt = (state: IWeb3State): string | undefined =>
  (state.connected &&
    state.wallet &&
    state.wallet.walletType === EWalletType.LIGHT &&
    state.wallet.salt) ||
  undefined;

export const selectIsUnlocked = (state: IWeb3State): boolean => {
  return state.connected && state.isUnlocked;
};

export const selectPreviousLightWalletEmail = (state: IWeb3State): string | undefined =>
  (!state.connected &&
    state.previousConnectedWallet &&
    state.previousConnectedWallet.walletType === EWalletType.LIGHT &&
    state.previousConnectedWallet.email) ||
  undefined;

export const selectPreviousLightWalletSalt = (state: IWeb3State): string | undefined =>
  (!state.connected &&
    state.previousConnectedWallet &&
    state.previousConnectedWallet.walletType === EWalletType.LIGHT &&
    state.previousConnectedWallet.salt) ||
  undefined;

export const selectPreviousConnectedWallet = (state: IWeb3State): TWalletMetadata | undefined =>
  (!state.connected && state.previousConnectedWallet) || undefined;

export const selectLightWalletFromQueryString = (
  state: RouterState,
): { email: string; salt: string } | undefined => {
  if (!state.location) {
    return undefined;
  }

  const params = queryString.parse(state.location.search);
  const redirect = params.redirect;
  const email = params.email || (redirect && queryString.parse(redirect).email);
  const salt = params.salt || (redirect && queryString.parse(redirect).salt);

  if (!email || !salt) {
    return undefined;
  }

  return {
    email,
    salt,
  };
};

export const selectActivationCodeFromQueryString = (
  state: RouterState,
): { verificationCode: string } | undefined => {
  const params = queryString.parse(state.location!.search);
  const redirect = params.redirect;
  const verificationCode = params.code || (redirect && queryString.parse(redirect).code);

  if (!verificationCode) {
    return undefined;
  }

  return {
    verificationCode,
  };
};

export const selectLightWalletEmailFromQueryString = (state: RouterState): string | undefined => {
  const lightWallet = selectLightWalletFromQueryString(state);

  return lightWallet && lightWallet.email;
};

export const selectEmailFromQueryString = (state: RouterState): string | undefined => {
  if (!state.location) {
    return undefined;
  }
  const params = queryString.parse(state.location.search);
  return params.email;
};
