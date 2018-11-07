import { BigNumber } from "bignumber.js";
import { inject, injectable } from "inversify";
import * as Web3 from "web3";

import { symbols } from "../../di/symbols";
import { calculateGasLimitWithOverhead, encodeTransaction } from "../../modules/tx/utils";
import { web3Actions } from "../../modules/web3/actions";
import { web3Flows } from "../../modules/web3/flows";
import { AppDispatch } from "../../store";
import { EthereumNetworkId } from "../../types";
import {
  AsyncIntervalScheduler,
  AsyncIntervalSchedulerFactoryType,
} from "../../utils/AsyncIntervalScheduler";
import { promiseTimeout } from "../../utils/promiseTimeout";
import { ILogger } from "../dependencies/Logger";
import { LightWallet } from "./LightWallet";
import { IPersonalWallet } from "./PersonalWeb3";
import { IEthereumNetworkConfig } from "./types";
import { Web3Adapter } from "./Web3Adapter";

export class WalletNotConnectedError extends Error {
  constructor(public readonly wallet: IPersonalWallet) {
    super("Wallet not connected");
  }
}
export class SignerError extends Error {}
export class SignerRejectConfirmationError extends SignerError {}
export class SignerTimeoutError extends SignerError {}
export class SignerUnknownError extends SignerError {}

export const WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL = 5000;

// singleton holding all web3 instances
@injectable()
export class Web3Manager {
  public personalWallet?: IPersonalWallet;
  public networkId!: EthereumNetworkId;
  public internalWeb3Adapter!: Web3Adapter;

  private readonly web3ConnectionWatcher: AsyncIntervalScheduler;

  constructor(
    @inject(symbols.ethereumNetworkConfig)
    public readonly ethereumNetworkConfig: IEthereumNetworkConfig,
    @inject(symbols.appDispatch) public readonly dispatch: AppDispatch,
    @inject(symbols.logger) public readonly logger: ILogger,
    @inject(symbols.asyncIntervalSchedulerFactory)
    asyncIntervalSchedulerFactory: AsyncIntervalSchedulerFactoryType,
  ) {
    this.web3ConnectionWatcher = asyncIntervalSchedulerFactory(
      this.watchConnection,
      WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL,
    );
  }

  public async initialize(): Promise<void> {
    const rawWeb3 = new Web3(new Web3.providers.HttpProvider(this.ethereumNetworkConfig.rpcUrl));
    this.internalWeb3Adapter = new Web3Adapter(rawWeb3);
    this.networkId = await this.internalWeb3Adapter.getNetworkId();
  }

  public async plugPersonalWallet(personalWallet: IPersonalWallet): Promise<void> {
    const isWalletConnected = await personalWallet.testConnection(this.networkId);
    if (!isWalletConnected) {
      throw new WalletNotConnectedError(personalWallet);
    }

    this.personalWallet = personalWallet;

    const isUnlocked =
      this.personalWallet instanceof LightWallet ? !!this.personalWallet.password : true;

    this.dispatch(
      web3Actions.newPersonalWalletPlugged(this.personalWallet.getMetadata(), isUnlocked),
    );

    this.web3ConnectionWatcher.start();
  }

  public async unplugPersonalWallet(): Promise<void> {
    this.web3ConnectionWatcher.stop();
    this.personalWallet = undefined;
    this.dispatch(web3Actions.personalWalletDisconnected());
  }

  public async sign(message: string): Promise<string> {
    if (this.personalWallet) {
      return this.personalWallet.signMessage(message);
    } else {
      throw new Error("No wallet!");
    }
  }

  public async sendTransaction(tx: Web3.TxData): Promise<string> {
    if (this.personalWallet) {
      return this.personalWallet.sendTransaction(tx);
    } else {
      throw new Error("No wallet!");
    }
  }

  public async getTransactionByHash(txHash: string): Promise<Web3.Transaction> {
    return this.internalWeb3Adapter.getTransactionByHash(txHash);
  }

  public async getBalance(userAddress: string): Promise<BigNumber> {
    return this.internalWeb3Adapter.getBalance(userAddress);
  }
  public async estimateGas(txData: Partial<Web3.TxData>): Promise<number> {
    const encodedTxData = encodeTransaction(txData);
    return this.internalWeb3Adapter.estimateGas(encodedTxData);
  }

  public async estimateGasWithOverhead(txData: Partial<Web3.TxData>): Promise<string> {
    const gas = await this.estimateGas(txData);
    return calculateGasLimitWithOverhead(gas);
  }

  private watchConnection = async () => {
    this.logger.verbose("Checking web3 status...");
    if (!this.personalWallet) {
      this.logger.error("Web3 watcher started without valid personalWallet instance!");
      return;
    }

    const isConnectionWorking = await promiseTimeout({
      promise: this.personalWallet.testConnection(this.networkId),
      defaultValue: false,
      timeout: WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL,
    });

    if (!isConnectionWorking) {
      this.onWeb3ConnectionLost();
    }
  };

  private onWeb3ConnectionLost = () => {
    this.logger.info("Web3 connection lost");
    this.dispatch(web3Flows.personalWalletDisconnected);

    this.web3ConnectionWatcher.stop();
  };
}
