import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import {
  BrowserWalletAccountApprovalPendingError,
  BrowserWalletAccountApprovalRejectedError,
  BrowserWalletLockedError,
  BrowserWalletMismatchedNetworkError,
  BrowserWalletMissingError,
} from "../../../lib/web3/BrowserWallet";
import { TTranslatedString } from "../../../types";

export function mapBrowserWalletErrorToErrorMessage(e: Error): TTranslatedString {
  if (e instanceof BrowserWalletLockedError) {
    return <FormattedMessage id="modules.wallet-selector.browser-wallet.browser-wallet-locked" />;
  }
  if (e instanceof BrowserWalletMismatchedNetworkError) {
    return <FormattedMessage id="modules.wallet-selector.browser-wallet.please-change-network" />;
  }
  if (e instanceof BrowserWalletMissingError) {
    return <FormattedMessage id="modules.wallet-selector.browser-wallet.browser-wallet-missing" />;
  }
  if (e instanceof BrowserWalletAccountApprovalRejectedError) {
    return <FormattedMessage id="modules.wallet-selector.browser-wallet.data-approval-rejected" />;
  }
  if (e instanceof BrowserWalletAccountApprovalPendingError) {
    return <FormattedMessage id="modules.wallet-selector.browser-wallet.data-approval-pending" />;
  }
  return "Web3 wallet not available";
}
//TODO: ADD TRANSLATIONS
