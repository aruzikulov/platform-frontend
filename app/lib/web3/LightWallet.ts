import { BigNumber } from "bignumber.js";
import { promisify } from "bluebird";
import * as LightWalletProvider from "eth-lightwallet";
import * as ethSig from "eth-sig-util";
import { addHexPrefix, hashPersonalMessage, toBuffer } from "ethereumjs-util";
import { inject, injectable } from "inversify";
import * as nacl from "tweetnacl";
import * as naclUtil from "tweetnacl-util";
import * as Web3 from "web3";
import * as Web3ProviderEngine from "web3-provider-engine";
// tslint:disable-next-line
import * as HookedWalletSubprovider from "web3-provider-engine/subproviders/hooked-wallet";
// tslint:disable-next-line
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";
import { IPersonalWallet, SignerType } from "./PersonalWeb3";
import { IEthereumNetworkConfig, IRawTxData } from "./types";

import { symbols } from "../../di/symbols";
import { EWalletSubType, EWalletType } from "../../modules/web3/types";
import { EthereumAddress } from "../../types";
import { ILightWalletMetadata } from "../persistence/WalletMetadataObjectStorage";
import { Web3Adapter } from "./Web3Adapter";

export interface ICreateVault {
  password: string;
  hdPathString: string;
  recoverSeed?: string | undefined;
  customSalt?: string | undefined;
}

export interface IVault {
  walletInstance: any;
  salt: string;
}

export interface ILightWallet {
  addresses: Array<string>;
  encHdRootPriv: object;
  encPrivKeys: object;
  encSeed: object;
  hdIndex: number;
  hdPathString: string;
  salt: string;
  version: number;
  getSeed: (walletKey: object) => string;
  signTransaction: (txParams: object) => void;
  getAddresses: () => Array<string>;
}

export class LightError extends Error {}
export class LightWalletUtilError extends LightError {}
export class LightWalletConnectorError extends LightError {}
export class LightWalletError extends LightError {}
export class LightWrongPasswordSaltError extends LightWalletUtilError {}
export class LightSignMessageError extends LightWalletError {}
export class LightUnknownError extends LightError {}
export class LightCreationError extends LightWalletUtilError {}
export class LightKeyEncryptError extends LightWalletUtilError {}
export class LightDeserializeError extends LightWalletUtilError {}
export class LightWalletMissingPasswordError extends LightWalletError {}
export class LightWalletWrongPassword extends LightWalletError {}
export class LightWalletLocked extends LightWalletError {}
export class LightWalletWrongMnemonic extends LightWalletError {}

export class ProviderEngineError extends LightError {}
export class NativeSignTransactionUserError extends ProviderEngineError {}

// it's useful to have it as a class to allow injection and mocking.Todo: remove static functions and probably move to separate file
@injectable()
export class LightWalletUtil {
  public async deserializeLightWalletVault(
    serializedWallet: string,
    salt: string,
  ): Promise<ILightWallet> {
    try {
      return await LightWalletProvider.keystore.deserialize(serializedWallet, salt);
    } catch (e) {
      throw new LightDeserializeError();
    }
  }

  public async createLightWalletVault({
    password,
    hdPathString,
    recoverSeed,
    customSalt,
  }: ICreateVault): Promise<IVault> {
    try {
      const create = promisify<any, object>(LightWalletProvider.keystore.createVault);
      //256bit strength generates a 24 word mnemonic
      const entropyStrength = 256;
      const seed = recoverSeed
        ? recoverSeed
        : LightWalletProvider.keystore.generateRandomSeed(undefined, entropyStrength);
      //salt strength should be 32 bit. see https://github.com/ConsenSys/eth-lightwallet/blob/master/lib/keystore.js#L107
      const salt = customSalt ? customSalt : LightWalletProvider.keystore.generateSalt(32);
      const lightWalletInstance = await create({
        password,
        seedPhrase: seed,
        hdPathString,
        salt,
      }).catch(() => {
        throw new LightWalletWrongMnemonic();
      });
      const unlockedWallet = await LightWalletUtil.getWalletKey(lightWalletInstance, password);
      lightWalletInstance.generateNewAddress(unlockedWallet, 1);
      return { walletInstance: await lightWalletInstance.serialize(), salt };
    } catch (e) {
      if (e instanceof LightWalletWrongMnemonic) throw new LightWalletWrongMnemonic();
      throw new LightCreationError();
    }
  }

  static async getWalletKey(lightWalletInstance: any, password: string): Promise<object> {
    try {
      const keyFromPassword = promisify<ILightWallet, string>(
        lightWalletInstance.keyFromPassword.bind(lightWalletInstance),
      );
      return await keyFromPassword(password);
    } catch (e) {
      throw new LightWrongPasswordSaltError();
    }
  }

  static async getWalletSeed(lightWalletInstance: any, password: string): Promise<string> {
    try {
      const keyFromPassword = promisify<ILightWallet, string>(
        lightWalletInstance.keyFromPassword.bind(lightWalletInstance),
      );
      return await lightWalletInstance.getSeed(await keyFromPassword(password));
    } catch (e) {
      throw new LightWrongPasswordSaltError();
    }
  }

  static async testWalletPassword(lightWalletInstance: any, password: string): Promise<boolean> {
    const key = await LightWalletUtil.getWalletKey(lightWalletInstance, password);
    return lightWalletInstance.isDerivedKeyCorrect(key);
  }

  public async getWalletKeyFromSaltAndPassword(
    salt: string,
    password: string,
    keySize: number = 32,
  ): Promise<Uint8Array> {
    try {
      const keyFromSaltAndPassword = promisify<any, string, string, number>(
        LightWalletProvider.keystore.deriveKeyFromPasswordAndSalt,
      );
      return await keyFromSaltAndPassword(password, salt, keySize);
    } catch (e) {
      throw new LightWrongPasswordSaltError();
    }
  }

  public encryptString({
    string,
    pwDerivedKey,
  }: {
    string: string;
    pwDerivedKey: Uint8Array;
  }): string {
    try {
      // nacl.secretbox nonce must be 24 bytes @see https://github.com/dchest/tweetnacl-js#naclsecretboxnoncelength--24
      const encObj = nacl.secretbox(
        naclUtil.decodeUTF8(string),
        pwDerivedKey.slice(32, 56),
        pwDerivedKey.slice(0, 32),
      );
      const encString = Buffer.from(encObj).toString("hex");
      return encString;
    } catch (e) {
      throw new LightKeyEncryptError();
    }
  }
}

export class LightWallet implements IPersonalWallet {
  constructor(
    public readonly web3Adapter: Web3Adapter,
    public readonly ethereumAddress: EthereumAddress,
    public readonly vault: IVault,
    public readonly email: string,
    public password?: string,
  ) {}

  public readonly walletType = EWalletType.LIGHT;
  public readonly walletSubType = EWalletSubType.UNKNOWN;

  public getSignerType(): SignerType {
    return SignerType.ETH_SIGN;
  }

  public async testConnection(networkId: string): Promise<boolean> {
    const currentNetworkId = await this.web3Adapter.getNetworkId();
    if (currentNetworkId !== networkId) {
      return false;
    }
    return !!(await this.web3Adapter.getAccountAddress());
  }

  public async signMessage(data: string): Promise<string> {
    if (!this.password) {
      throw new LightWalletMissingPasswordError();
    }
    try {
      const msgHash = hashPersonalMessage(toBuffer(addHexPrefix(data)));
      const rawSignedMsg = await LightWalletProvider.signing.signMsgHash(
        this.vault.walletInstance,
        await LightWalletUtil.getWalletKey(this.vault.walletInstance, this.password),
        msgHash.toString("hex"),
        this.ethereumAddress,
      );
      // from signature parameters to eth_sign RPC
      // @see https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#torpcsig
      return ethSig.concatSig(rawSignedMsg.v, rawSignedMsg.r, rawSignedMsg.s);
    } catch (e) {
      throw new LightSignMessageError();
    }
  }

  public async sendTransaction(txData: Web3.TxData): Promise<string> {
    if (!this.password) {
      throw new LightWalletMissingPasswordError();
    }
    const nonce = await this.web3Adapter.getTransactionCount(txData.from);

    const encodedTxData: IRawTxData = {
      from: txData.from,
      to: addHexPrefix(txData.to!),
      gas: addHexPrefix(new BigNumber(txData.gas || 0).toString(16)),
      gasPrice: addHexPrefix(new BigNumber(txData.gasPrice || 0).toString(16)),
      nonce: addHexPrefix(new BigNumber(nonce || 0).toString(16)),
      value: addHexPrefix(new BigNumber(txData.value! || 0).toString(16)),
      data: addHexPrefix(txData.data || "0"),
    };

    const rawData = LightWalletProvider.signing.signTx(
      this.vault.walletInstance,
      await LightWalletUtil.getWalletKey(this.vault.walletInstance, this.password),
      encodedTxData,
      this.ethereumAddress,
    );
    return await this.web3Adapter.sendRawTransaction(addHexPrefix(rawData));
  }

  public async getSeed(): Promise<string> {
    if (!this.password) {
      throw new LightWalletMissingPasswordError();
    }
    return await LightWalletUtil.getWalletSeed(this.vault.walletInstance, this.password);
  }

  public async testPassword(newPassword: string): Promise<boolean> {
    return await LightWalletUtil.testWalletPassword(this.vault.walletInstance, newPassword);
  }

  public getMetadata(): ILightWalletMetadata {
    return {
      address: this.ethereumAddress,
      email: this.email,
      salt: this.vault.salt,
      vault: JSON.stringify(this.vault.walletInstance),
      walletType: this.walletType,
      walletSubType: this.walletSubType,
    };
  }
}

@injectable()
export class LightWalletConnector {
  private web3Adapter?: Web3Adapter;
  public constructor(
    @inject(symbols.ethereumNetworkConfig) public readonly web3Config: IEthereumNetworkConfig,
  ) {}

  public passwordProvider(): any {
    return "";
  }

  public async connect(
    lightWalletVault: IVault,
    email: string,
    password?: string,
  ): Promise<IPersonalWallet> {
    try {
      this.web3Adapter = new Web3Adapter(await this.setWeb3Provider(lightWalletVault));
      return new LightWallet(
        this.web3Adapter,
        await this.web3Adapter.getAccountAddress(),
        lightWalletVault,
        email,
        password,
      );
    } catch (e) {
      if (e instanceof LightError) {
        throw e;
      } else {
        throw new LightUnknownError();
      }
    }
  }

  private async setWeb3Provider(lightWalletVault: IVault): Promise<any> {
    let engine: any;
    lightWalletVault.walletInstance.passwordProvider = (callback: any) => {
      return callback(null, this.passwordProvider());
    };

    try {
      // hooked-wallet-subprovider required methods were manually implemented
      const web3Provider = new HookedWalletSubprovider({
        signTransaction: () => {
          // Native signTransaction Shouldn't be used
          throw new NativeSignTransactionUserError();
        },
        getAccounts: (cb: any) => {
          const data = lightWalletVault.walletInstance.getAddresses.bind(
            lightWalletVault.walletInstance,
          )();
          cb(undefined, data);
        },
      });
      engine = new Web3ProviderEngine();
      engine.addProvider(web3Provider);
      engine.addProvider(
        new RpcSubprovider({
          rpcUrl: this.web3Config.rpcUrl,
        }),
      );
      engine.start();
      return new Web3(engine);
    } catch (e) {
      if (engine) {
        engine.stop();
      }
      throw e;
    }
  }
}
