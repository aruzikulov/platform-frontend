import { BrowserWalletError } from "../../lib/web3/BrowserWallet";
import { mapSignerErrorToErrorMessage } from "../../lib/web3/errors";
import { LedgerError } from "../../lib/web3/LedgerWallet";
import { LightWalletError } from "../../lib/web3/LightWallet";
import { SignerError } from "../../lib/web3/Web3Manager";
import { EthereumAddress } from "../../types";
import { mapBrowserWalletErrorToErrorMessage } from "../wallet-selector/browser-wizard/errors";
import { mapLedgerErrorToErrorMessage } from "../wallet-selector/ledger-wizard/errors";
import { mapLightWalletErrorToErrorMessage } from "../wallet-selector/light-wizard/errors";

export class MismatchedWalletAddressError extends Error {
  constructor(
    public readonly desiredAddress: EthereumAddress,
    public readonly actualAddress: EthereumAddress,
  ) {
    super(
      `Plugged wallet address is: ${actualAddress}, expected wallet address is: ${desiredAddress}`,
    );
  }
}

export function mapSignMessageErrorToErrorMessage(error: Error): string {
  if (error instanceof BrowserWalletError) {
    return mapBrowserWalletErrorToErrorMessage(error);
  }
  if (error instanceof LedgerError) {
    return mapLedgerErrorToErrorMessage(error);
  }
  if (error instanceof LightWalletError) {
    return mapLightWalletErrorToErrorMessage(error);
  }
  if (error instanceof SignerError) {
    return mapSignerErrorToErrorMessage(error);
  }
  if (error instanceof MismatchedWalletAddressError) {
    return error.message;
  }
  return "Unknown error";
}
