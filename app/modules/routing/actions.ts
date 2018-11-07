import { push } from "react-router-redux";

import { appRoutes } from "../../components/appRoutes";
import { kycRoutes } from "../../components/kyc/routes";
import { recoverRoutes } from "../../components/wallet-selector/wallet-recover/recoverRoutes";
import { walletRoutes } from "../../components/wallet/routes";
import { createAction } from "../actionsUtils";

const createRoutingAction = (path: string) => push(path);

export const routingActions = {
  // navigation primitives
  goBack: () => createAction("GO_BACK", {}),
  goTo: (absolutePath: string) => createRoutingAction(absolutePath),

  // default routes
  goHome: () => createRoutingAction("/"),
  goEtoHome: () => createRoutingAction("/eto-landing"),

  //kyc routes
  goToKYCHome: () => createRoutingAction(kycRoutes.start),
  goToKYCIndividualStart: () => createRoutingAction(kycRoutes.individualStart),
  goToKYCIndividualInstantId: () => createRoutingAction(kycRoutes.individualInstantId),
  goToKYCIndividualUpload: () => createRoutingAction(kycRoutes.individualUpload),

  goToKYCBusinessStart: () => createRoutingAction(kycRoutes.businessStart),
  goToKYCLegalRepresentative: () => createRoutingAction(kycRoutes.legalRepresentative),
  goToKYCBusinessData: () => createRoutingAction(kycRoutes.businessData),
  goToKYCBeneficialOwners: () => createRoutingAction(kycRoutes.beneficialOwners),

  // dashboard
  goToDashboard: () => createRoutingAction(appRoutes.dashboard),
  goToSettings: () => createRoutingAction(appRoutes.settings),

  // registration
  goToRegister: () => createRoutingAction(appRoutes.register),

  // login
  goToLogin: () => createRoutingAction(appRoutes.login),
  goToEtoLogin: () => createRoutingAction(appRoutes.loginEto),

  // Successful password recovery
  goToSuccessfulRecovery: () => createRoutingAction(recoverRoutes.success),

  // wallet
  goToWallet: () => createRoutingAction(appRoutes.wallet),

  // deposit founds
  goToDepositEuroToken: () => createRoutingAction(walletRoutes.euroToken),
  goToDepositEth: () => createRoutingAction(walletRoutes.eth),

  // other...
};
