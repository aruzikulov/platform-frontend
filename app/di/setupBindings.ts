import { Container } from "inversify";
import { push } from "react-router-redux";
import { MiddlewareAPI } from "redux";
import { IConfig } from "../config/getConfig";
import { AuthorizedBinaryHttpClient } from "../lib/api/client/AuthBinaryHttpClient";
import { BinaryHttpClient } from "../lib/api/client/BinaryHttpClient";
import { IHttpClient } from "../lib/api/client/IHttpClient";
import { JsonHttpClient } from "../lib/api/client/JsonHttpClient";
import { SignatureAuthApi } from "../lib/api/SignatureAuthApi";
import { UsersApi } from "../lib/api/users/UsersApi";
import { VaultApi } from "../lib/api/vault/VaultApi";
import { cryptoRandomString, CryptoRandomString } from "../lib/dependencies/cryptoRandomString";
import { DevConsoleLogger, ILogger, noopLogger } from "../lib/dependencies/Logger";
import { NotificationCenter } from "../lib/dependencies/NotificationCenter";
import { Storage } from "../lib/persistence/Storage";
import { BrowserWalletConnector } from "../lib/web3/BrowserWallet";
import { LedgerWalletConnector } from "../lib/web3/LedgerWallet";
import { LightWalletConnector, LightWalletUtil } from "../lib/web3/LightWallet";
import { Web3Manager } from "../lib/web3/Web3Manager";
import { IAppState } from "../store";
import {
  AsyncIntervalSchedulerFactory,
  AsyncIntervalSchedulerFactoryType,
} from "../utils/AsyncIntervalScheduler";

import { AuthorizedJsonHttpClient } from "../lib/api/client/AuthJsonHttpClient";
import { EtoApi } from "../lib/api/eto/EtoApi";
import { EtoFileApi } from "../lib/api/eto/EtoFileApi";
import { EtoPledgeApi } from "../lib/api/eto/EtoPledgeApi";
import { FileStorageApi } from "../lib/api/FileStorageApi";
import { GasApi } from "../lib/api/GasApi";
import { ImmutableStorageApi } from "../lib/api/ImmutableStorageApi";
import { KycApi } from "../lib/api/KycApi";
import { detectBrowser, TDetectBrowser } from "../lib/dependencies/detectBrowser";
import { IntlWrapper } from "../lib/intl/IntlWrapper";
import { STORAGE_JWT_KEY } from "../lib/persistence/JwtObjectStorage";
import { ObjectStorage } from "../lib/persistence/ObjectStorage";
import { TWalletMetadata } from "../lib/persistence/WalletMetadataObjectStorage";
import { WalletStorage } from "../lib/persistence/WalletStorage";
import { ContractsService } from "../lib/web3/ContractsService";
import { IEthereumNetworkConfig } from "./../lib/web3/types";
import { symbols } from "./symbols";

export type NavigateTo = (path: string) => void;
export type GetState = () => IAppState;

export function setupBindings(config: IConfig): Container {
  const container = new Container();
  const storage = new Storage(window.localStorage);

  // functions
  container
    .bind<CryptoRandomString>(symbols.cryptoRandomString)
    .toConstantValue(cryptoRandomString);
  container.bind<TDetectBrowser>(symbols.detectBrowser).toConstantValue(detectBrowser);

  // configs
  container
    .bind<IEthereumNetworkConfig>(symbols.ethereumNetworkConfig)
    .toConstantValue(config.ethereumNetwork);
  container.bind<IConfig>(symbols.config).toConstantValue(config);

  // @todo different logger could be injected to each class with additional info like name of the file etc.
  if (process.env.NODE_ENV === "production") {
    container.bind(symbols.logger).toConstantValue(noopLogger);
  } else {
    container.bind<ILogger>(symbols.logger).toConstantValue(new DevConsoleLogger());
  }

  // classes
  container
    .bind<IHttpClient>(symbols.jsonHttpClient)
    .to(JsonHttpClient)
    .inSingletonScope();
  container
    .bind<IHttpClient>(symbols.binaryHttpClient)
    .to(BinaryHttpClient)
    .inSingletonScope();
  container
    .bind<IHttpClient>(symbols.authorizedJsonHttpClient)
    .to(AuthorizedJsonHttpClient)
    .inSingletonScope();
  container
    .bind<IHttpClient>(symbols.authorizedBinaryHttpClient)
    .to(AuthorizedBinaryHttpClient)
    .inSingletonScope();

  // singletons
  container
    .bind<SignatureAuthApi>(symbols.signatureAuthApi)
    .to(SignatureAuthApi)
    .inSingletonScope();

  container
    .bind<LightWalletUtil>(symbols.lightWalletUtil)
    .to(LightWalletUtil)
    .inSingletonScope();

  container
    .bind<VaultApi>(symbols.vaultApi)
    .to(VaultApi)
    .inSingletonScope();

  container
    .bind<UsersApi>(symbols.usersApi)
    .to(UsersApi)
    .inSingletonScope();

  container.bind<Storage>(symbols.storage).toConstantValue(storage);
  container
    .bind<NotificationCenter>(symbols.notificationCenter)
    .to(NotificationCenter)
    .inSingletonScope();

  // web3 & blockchain
  container
    .bind(symbols.contractsService)
    .to(ContractsService)
    .inSingletonScope();
  container
    .bind<LedgerWalletConnector>(symbols.ledgerWalletConnector)
    .to(LedgerWalletConnector)
    .inSingletonScope();

  container
    .bind<LightWalletConnector>(symbols.lightWalletConnector)
    .to(LightWalletConnector)
    .inSingletonScope();

  container
    .bind<BrowserWalletConnector>(symbols.browserWalletConnector)
    .to(BrowserWalletConnector)
    .inSingletonScope();
  container
    .bind<Web3Manager>(symbols.web3Manager)
    .to(Web3Manager)
    .inSingletonScope();
  container
    .bind<KycApi>(symbols.apiKycService)
    .to(KycApi)
    .inSingletonScope();
  container
    .bind<EtoApi>(symbols.apiEtoService)
    .to(EtoApi)
    .inSingletonScope();
  container
    .bind<EtoPledgeApi>(symbols.apiEtoPledgeService)
    .to(EtoPledgeApi)
    .inSingletonScope();
  container
    .bind<EtoFileApi>(symbols.apiEtoFileService)
    .to(EtoFileApi)
    .inSingletonScope();
  container
    .bind<WalletStorage<TWalletMetadata>>(symbols.walletStorage)
    .to(WalletStorage)
    .inSingletonScope();
  container
    .bind(symbols.fileStorageService)
    .to(FileStorageApi)
    .inSingletonScope();
  container
    .bind(symbols.apiImmutableStorage)
    .to(ImmutableStorageApi)
    .inSingletonScope();
  container
    .bind(symbols.gasApi)
    .to(GasApi)
    .inSingletonScope();

  // factories
  container
    .bind<AsyncIntervalSchedulerFactoryType>(symbols.asyncIntervalSchedulerFactory)
    .toFactory(AsyncIntervalSchedulerFactory);

  // dynamic bindings (with inSingletonScope this works like lazy binding)
  container
    .bind<ObjectStorage<string>>(symbols.jwtStorage)
    .toDynamicValue(
      ctx =>
        new ObjectStorage<string>(
          ctx.container.get(symbols.storage),
          ctx.container.get(symbols.logger),
          STORAGE_JWT_KEY,
        ),
    )
    .inSingletonScope();

  container.bind(symbols.intlWrapper).toConstantValue(new IntlWrapper());

  return container;
}

export function customizerContainerWithMiddlewareApi(
  container: Container,
  { dispatch, getState }: MiddlewareAPI<any>,
): Container {
  container.bind(symbols.appDispatch).toConstantValue(dispatch);
  container.bind(symbols.getState).toConstantValue(() => getState());
  container.bind(symbols.navigateTo).toConstantValue((path: string) => dispatch(push(path)));

  return container;
}

/**
 * We use plain object for injecting deps into sagas
 */
export const createGlobalDependencies = (container: Container) => ({
  // misc
  logger: container.get<ILogger>(symbols.logger),
  notificationCenter: container.get<NotificationCenter>(symbols.notificationCenter),

  // TODO this should be replace by sagas yield select in the future
  getState: container.get<GetState>(symbols.getState),
  cryptoRandomString: container.get<CryptoRandomString>(symbols.cryptoRandomString),
  detectBrowser: container.get<TDetectBrowser>(symbols.detectBrowser),

  // blockchain & wallets
  contractsService: container.get<ContractsService>(symbols.contractsService),
  web3Manager: container.get<Web3Manager>(symbols.web3Manager),
  walletStorage: container.get<WalletStorage<TWalletMetadata>>(symbols.walletStorage),
  lightWalletConnector: container.get<LightWalletConnector>(symbols.lightWalletConnector),
  jwtStorage: container.get<ObjectStorage<string>>(symbols.jwtStorage),
  lightWalletUtil: container.get<LightWalletUtil>(symbols.lightWalletUtil),
  browserWalletConnector: container.get<BrowserWalletConnector>(symbols.browserWalletConnector),
  ledgerWalletConnector: container.get<LedgerWalletConnector>(symbols.ledgerWalletConnector),

  // network layer
  binaryHttpClient: container.get<BinaryHttpClient>(symbols.binaryHttpClient),
  jsonHttpClient: container.get<JsonHttpClient>(symbols.jsonHttpClient),
  authorizedJsonHttpClient: container.get<AuthorizedJsonHttpClient>(
    symbols.authorizedJsonHttpClient,
  ),
  authorizedBinaryHttpClient: container.get<AuthorizedBinaryHttpClient>(
    symbols.authorizedBinaryHttpClient,
  ),

  // apis
  signatureAuthApi: container.get<SignatureAuthApi>(symbols.signatureAuthApi),
  apiKycService: container.get<KycApi>(symbols.apiKycService),
  apiEtoService: container.get<EtoApi>(symbols.apiEtoService),
  apiEtoPledgeService: container.get<EtoPledgeApi>(symbols.apiEtoPledgeService),
  apiEtoFileService: container.get<EtoFileApi>(symbols.apiEtoFileService),
  apiUserService: container.get<UsersApi>(symbols.usersApi),
  vaultApi: container.get<VaultApi>(symbols.vaultApi),
  fileStorageApi: container.get<FileStorageApi>(symbols.fileStorageService),
  gasApi: container.get<GasApi>(symbols.gasApi),
  apiImmutableStorage: container.get<ImmutableStorageApi>(symbols.apiImmutableStorage),

  intlWrapper: container.get<IntlWrapper>(symbols.intlWrapper),
});

export type TGlobalDependencies = ReturnType<typeof createGlobalDependencies>;
