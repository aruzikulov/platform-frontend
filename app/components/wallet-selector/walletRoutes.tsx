import { appRoutes } from "../appRoutes";

const parentRegisterRoutePath = appRoutes.register;
export const walletRegisterRoutes = {
  light: parentRegisterRoutePath + "/light",
  browser: parentRegisterRoutePath + "/browser",
  ledger: parentRegisterRoutePath + "/ledger",
};

const parentLoginRoutePath = appRoutes.login;
export const loginWalletRoutes = {
  light: parentLoginRoutePath + "/light",
  browser: parentLoginRoutePath + "/browser",
  ledger: parentLoginRoutePath + "/ledger",
};
