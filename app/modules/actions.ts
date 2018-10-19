import { TDictionaryValues } from "../types";
import { accessWalletActions } from "./access-wallet/actions";
import { authActions } from "./auth/actions";
import { bookBuildingFlowActions } from "./bookbuilding-flow/actions";
import { depositModalActions } from "./deposit-eth-modal/actions";
import { etoDocumentsActions } from "./eto-documents/actions";
import { etoFlowActions } from "./eto-flow/actions";
import { gasActions } from "./gas/actions";
import { genericModalActions } from "./generic-modal/actions";
import { icbmWalletBalanceModalActions } from "./icbm-wallet-balance-modal/actions";
import { immutableStorageActions } from "./immutable-file/actions";
import { initActions } from "./init/actions";
import { investmentFlowActions } from "./investment-flow/actions";
import { investorEtoTicketActions } from "./investor-tickets/actions";
import { kycActions } from "./kyc/actions";
import { notificationActions } from "./notifications/actions";
import { personProfileModalActions } from "./person-profile-modal/actions";
import { etoActions } from "./public-etos/actions";
import { routingActions } from "./routing/actions";
import { settingsActions } from "./settings/actions";
import { formSingleFileUploadActions } from "./shared/formSingleFileUpload/actions";
import { remoteFileActions } from "./shared/remoteFile/actions";
import { tokenPriceActions } from "./shared/tokenPrice/actions";
import { txMonitorActions } from "./tx/monitor/actions";
import { txSenderActions } from "./tx/sender/actions";
import { userAgentActions } from "./user-agent/actions";
import { verifyEmailActions } from "./verify-email-widget/actions";
import { videoModalActions } from "./video-modal/actions";
import { walletSelectorActions } from "./wallet-selector/actions";
import { walletActions } from "./wallet/actions";
import { web3Actions } from "./web3/actions";

/** You should add new actions also here (with a namespace).*/
export const actions = {
  settings: settingsActions,
  immutableStorage: immutableStorageActions,
  verifyEmail: verifyEmailActions,
  genericModal: genericModalActions,
  signMessageModal: accessWalletActions,
  tokenPrice: tokenPriceActions,
  init: initActions,
  kyc: kycActions,
  routing: routingActions,
  walletSelector: walletSelectorActions,
  web3: web3Actions,
  investorEtoTicket: investorEtoTicketActions,
  userAgent: userAgentActions,
  auth: authActions,
  wallet: walletActions,
  notifications: notificationActions,
  etoFlow: etoFlowActions,
  etoDocuments: etoDocumentsActions,
  publicEtos: etoActions,
  bookBuilding: bookBuildingFlowActions,
  formSingleFileUpload: formSingleFileUploadActions,
  remoteFile: remoteFileActions,
  depositEthModal: depositModalActions,
  icbmWalletBalanceModal: icbmWalletBalanceModalActions,
  txMonitor: txMonitorActions,
  txSender: txSenderActions,
  gas: gasActions,
  investmentFlow: investmentFlowActions,
  videoModal: videoModalActions,
  personProfileModal: personProfileModalActions,
};

/**
 * Build action union type
 */
type TActions = typeof actions;

type TAllActions = TActions[keyof TActions];
type TActionCreatorsUnionType = TDictionaryValues<TAllActions>;

export type TAction = ReturnType<TActionCreatorsUnionType>;
export type TActionType = TAction["type"];
