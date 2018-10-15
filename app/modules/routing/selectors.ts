import * as queryString from "query-string";
import { RouterState } from "react-router-redux";
import { EWalletType } from "../web3/types";

export const selectRedirectURLFromQueryString = (state: RouterState): string | undefined => {
  if (!(state.location && state.location.search)) {
    return undefined;
  }
  const params = queryString.parse(state.location.search);
  const redirect = params.redirect;

  if (!redirect) {
    return undefined;
  }

  return redirect;
};

export const selectWalletTypeFromQueryString = (state: RouterState): EWalletType => {
  if (!(state.location && state.location.search)) {
    return EWalletType.UNKNOWN;
  }
  const params = queryString.parse(state.location.search);
  const walletType: string | undefined = params.wallet_type;
  switch (walletType) {
    case "ledger":
      return EWalletType.LEDGER;
    case "browser":
      return EWalletType.BROWSER;
    case "light":
      return EWalletType.LIGHT;
    default:
      return EWalletType.UNKNOWN;
  }
};
