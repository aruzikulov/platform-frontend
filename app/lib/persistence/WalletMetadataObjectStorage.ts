import { EWalletSubType, EWalletType } from "../../modules/web3/types";
import { EthereumAddress } from "../../types";

export type TWalletMetadata = ILightWalletMetadata | IBrowserWalletMetadata | ILedgerWalletMetadata;

export interface ICommonWalletMetadata {
  address: EthereumAddress;
}

export interface ILightWalletMetadata extends ICommonWalletMetadata {
  walletType: EWalletType.LIGHT;
  walletSubType: EWalletSubType.UNKNOWN;
  vault: string;
  salt: string;
  email: string;
}

/**
 * Data that are needed to recreate light wallet instance. Note that its missing ethereum address since it will be derived from vault.
 */
export interface ILightWalletRetrieveMetadata {
  walletType: EWalletType.LIGHT;
  vault: string;
  salt: string;
  email: string;
}

export interface IBrowserWalletMetadata extends ICommonWalletMetadata {
  walletType: EWalletType.BROWSER;
  walletSubType: EWalletSubType;
}

export interface ILedgerWalletMetadata extends ICommonWalletMetadata {
  walletType: EWalletType.LEDGER;
  walletSubType: EWalletSubType.UNKNOWN;
  derivationPath: string;
}

export const STORAGE_WALLET_METADATA_ISSUER_KEY = "NF_WALLET_ISSUER_METADATA";
export const STORAGE_WALLET_METADATA_INVESTOR_KEY = "NF_WALLET_METADATA";
