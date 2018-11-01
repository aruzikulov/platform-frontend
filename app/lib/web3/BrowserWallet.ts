import { promisify } from "bluebird";
import * as hex2ascii from "hex2ascii";
import { injectable } from "inversify";
import * as Web3 from "web3";

import { EWalletSubType, EWalletType } from "../../modules/web3/types";
import { EthereumAddress, EthereumNetworkId } from "../../types";
import { IBrowserWalletMetadata } from "../persistence/WalletMetadataObjectStorage";
import { IPersonalWallet, SignerType } from "./PersonalWeb3";
import { Web3Adapter } from "./Web3Adapter";
import { SignerRejectConfirmationError } from "./Web3Manager";

export class BrowserWalletError extends Error {}
export class BrowserWalletMissingError extends BrowserWalletError {}
export class BrowserWalletMismatchedNetworkError extends BrowserWalletError {
  constructor(
    public readonly desiredNetworkId: EthereumNetworkId,
    public readonly actualNetworkId: EthereumNetworkId,
  ) {
    super("MismatchedNetworkError");
  }
}
export class BrowserWalletLockedError extends BrowserWalletError {}
export class BrowserWalletAccountApprovalRejectedError extends BrowserWalletError {}
export class BrowserWalletAccountApprovalPendingError extends BrowserWalletError {}
export class BrowserWalletConfirmationRejectedError extends BrowserWalletError {}
export class BrowserWalletUnknownError extends BrowserWalletError {}

export class BrowserWallet implements IPersonalWallet {
  public readonly walletType = EWalletType.BROWSER;

  constructor(
    public readonly web3Adapter: Web3Adapter,
    public readonly walletSubType: EWalletSubType,
    public readonly ethereumAddress: EthereumAddress,
  ) {}

  public getSignerType(): SignerType {
    if (this.walletSubType === EWalletSubType.METAMASK) {
      return SignerType.ETH_SIGN_TYPED_DATA;
    } else {
      return SignerType.ETH_SIGN;
    }
  }

  public async testConnection(networkId: string): Promise<boolean> {
    const currentNetworkId = await this.web3Adapter.getNetworkId();
    if (currentNetworkId !== networkId) {
      return false;
    }

    return !!(await this.web3Adapter.getAccountAddress());
  }

  public async signMessage(data: string): Promise<string> {
    try {
      if (this.walletSubType === EWalletSubType.METAMASK) {
        const typedDataDecoded = JSON.parse(hex2ascii(data));
        // We can await as signTypedData function already awaits inside for result of RPC call.
        return await this.web3Adapter.signTypedData(this.ethereumAddress, typedDataDecoded);
      } else {
        return await this.web3Adapter.ethSign(this.ethereumAddress, "0x" + data);
      }
    } catch (e) {
      const error = parseBrowserWalletError(e);
      if (error instanceof BrowserWalletConfirmationRejectedError) {
        throw new SignerRejectConfirmationError();
      } else {
        throw error;
      }
    }
  }

  public async sendTransaction(data: Web3.TxData): Promise<string> {
    return this.web3Adapter.sendTransaction(data);
  }

  public getMetadata(): IBrowserWalletMetadata {
    return {
      address: this.ethereumAddress,
      walletType: EWalletType.BROWSER,
      walletSubType: this.walletSubType,
    };
  }
}

@injectable()
export class BrowserWalletConnector {
  dataApprovalPending: boolean;

  constructor() {
    this.dataApprovalPending = false;
  }

  public async connect(networkId: EthereumNetworkId): Promise<BrowserWallet> {
    let newMetamask = true;
    let injectedWeb3Provider;

    if (typeof (window as any).ethereum !== "undefined") {
      injectedWeb3Provider = (window as any).ethereum;
    } else {
      newMetamask = false;
      const injectedWeb3 = (window as any).web3;
      if (typeof injectedWeb3 === "undefined") {
        throw new BrowserWalletMissingError();
      }
      injectedWeb3Provider = injectedWeb3.currentProvider;
    }

    const newWeb3 = new Web3(injectedWeb3Provider);
    const web3Adapter = new Web3Adapter(newWeb3);
    // check for mismatched networkIds
    const personalWeb3NetworkId = await web3Adapter.getNetworkId();
    if (networkId !== personalWeb3NetworkId) {
      throw new BrowserWalletMismatchedNetworkError(networkId, personalWeb3NetworkId);
    }

    // TODO: this ugly code will be straighten when we drop suport for outdated Metamask versions - see github issue 1702
    if (!(await web3Adapter.getAccountAddress())) {
      if (newMetamask) {
        if (this.dataApprovalPending) {
          throw new BrowserWalletAccountApprovalPendingError();
        } else {
          try {
            this.dataApprovalPending = true;
            await injectedWeb3Provider.enable();
          } catch (e) {
            throw new BrowserWalletAccountApprovalRejectedError();
          } finally {
            this.dataApprovalPending = false;
          }
        }
        // Metamask ver that only partly implements EIP will resolve promise obtained from .enable() call but it still
        // can be in locked mode so no accounts will be returned. That's why we need second check.
        if (!(await web3Adapter.getAccountAddress())) {
          throw new BrowserWalletLockedError();
        }
        // For old Metamask versions is there are no accounts returned it means plugin is locked.
      } else {
        throw new BrowserWalletLockedError();
      }
    }

    const walletType = await this.getBrowserWalletType(web3Adapter.web3);
    const ethereumAddress = await web3Adapter.getAccountAddress();

    return new BrowserWallet(web3Adapter, walletType, ethereumAddress);
  }

  private async getBrowserWalletType(web3: Web3): Promise<EWalletSubType> {
    const nodeIdString = await promisify(web3.version.getNode)();
    const matchNodeIdString = nodeIdString.toLowerCase();

    if (matchNodeIdString.includes("metamask")) {
      return EWalletSubType.METAMASK;
    }
    if (matchNodeIdString.includes("parity")) {
      return EWalletSubType.PARITY;
    }
    // @todo support for mist
    return EWalletSubType.UNKNOWN;
  }
}

// At this moment it's only Metamask and Parity
export function parseBrowserWalletError(error: any): BrowserWalletError {
  // detect Metamask rejection
  if (
    error.code !== undefined &&
    error.message !== undefined &&
    error.code === -32603 &&
    error.message.startsWith("Error: MetaMask Message Signature: User denied message signature.")
  ) {
    return new BrowserWalletConfirmationRejectedError();
  }
  // detect Parity rejection
  if (error.message !== undefined && error.message.startsWith("Request has been rejected.")) {
    return new BrowserWalletConfirmationRejectedError();
  }

  return new BrowserWalletUnknownError();
}
