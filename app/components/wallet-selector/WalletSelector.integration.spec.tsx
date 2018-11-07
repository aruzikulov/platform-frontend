import { BigNumber } from "bignumber.js";
import { expect } from "chai";

import { createMount } from "../../../test/createMount";
import { dummyEthereumAddress, dummyNetworkId } from "../../../test/fixtures";
import {
  createIntegrationTestsSetup,
  waitForPredicate,
  waitForTid,
  wrapWithProviders,
} from "../../../test/integrationTestUtils";
import { globalFakeClock } from "../../../test/setupTestsHooks";
import { createMock, tid } from "../../../test/testUtils";
import { symbols } from "../../di/symbols";
import { SignatureAuthApi } from "../../lib/api/SignatureAuthApi";
import { getDummyUser } from "../../lib/api/users/fixtures";
import { UsersApi } from "../../lib/api/users/UsersApi";
import { IdentityRegistry } from "../../lib/contracts/IdentityRegistry";
import { Neumark } from "../../lib/contracts/Neumark";
import {
  IBrowserWalletMetadata,
  ILedgerWalletMetadata,
} from "../../lib/persistence/WalletMetadataObjectStorage";
import {
  BrowserWallet,
  BrowserWalletConnector,
  BrowserWalletLockedError,
  BrowserWalletMissingError,
} from "../../lib/web3/BrowserWallet";
import { ContractsService } from "../../lib/web3/ContractsService";
import { LedgerWallet, LedgerWalletConnector } from "../../lib/web3/LedgerWallet";
import { SignerType } from "../../lib/web3/PersonalWeb3";
import { Web3Adapter } from "../../lib/web3/Web3Adapter";
import { Web3ManagerMock } from "../../lib/web3/Web3Manager.mock";
import { actions } from "../../modules/actions";
import { EWalletSubType, EWalletType } from "../../modules/web3/types";
import { appRoutes } from "../appRoutes";
import { BROWSER_WALLET_RECONNECT_INTERVAL } from "./browser/WalletBrowser";
import { LEDGER_RECONNECT_INTERVAL } from "./ledger/WalletLedgerInitComponent";
import { walletRegisterRoutes } from "./walletRoutes";
import { WalletSelector } from "./WalletSelector";

describe("Wallet selector integration", () => {
  it("should select ledger wallet", async () => {
    const expectedDerivationPath = "44'/60'/0'/1";
    const expectedAddress = dummyEthereumAddress;
    const expectedChallenge = "CHALLENGE";

    const ledgerWalletMock = createMock(LedgerWallet, {
      walletType: EWalletType.LEDGER,
      walletSubType: EWalletSubType.UNKNOWN,
      ethereumAddress: expectedAddress,
      getSignerType: () => SignerType.ETH_SIGN,
      testConnection: async () => false,
      getMetadata: (): ILedgerWalletMetadata => ({
        walletType: EWalletType.LEDGER,
        walletSubType: EWalletSubType.UNKNOWN,
        derivationPath: expectedDerivationPath,
        address: expectedAddress,
      }),
    });
    const ledgerWalletConnectorMock = createMock(LedgerWalletConnector, {});
    const internalWeb3AdapterMock = createMock(Web3Adapter, {
      getBalance: async () => new BigNumber(1),
    });
    const signatureAuthApiMock = createMock(SignatureAuthApi, {
      challenge: async () => ({
        statusCode: 200,
        body: {
          challenge: expectedChallenge,
        },
      }),
      createJwt: async () => ({
        statusCode: 200,
        body: {
          jwt: "JWT",
        },
      }),
    });
    const usersApiMock = createMock(UsersApi, {
      me: async () => getDummyUser(ledgerWalletMock.getMetadata()),
      createAccount: async () => getDummyUser(ledgerWalletMock.getMetadata()),
    });

    const contractsMock = createMock(ContractsService, {
      neumark: createMock(Neumark, {
        balanceOf: (_address: string) => Promise.resolve(new BigNumber(1)),
      }),
      identityRegistry: createMock(IdentityRegistry, {
        getClaims: (_userId: string) => Promise.resolve("01001110"),
      }),
    });

    const { store, container, dispatchSpy, history } = createIntegrationTestsSetup({
      ledgerWalletConnectorMock,
      signatureAuthApiMock,
      usersApiMock,
      contractsMock,
      initialState: {
        browser: {
          name: "chrome",
          version: "58.0.0",
        },
        init: {
          appInit: {
            done: true,
            inProgress: false,
          },
          smartcontractsInit: {
            done: true,
            inProgress: false,
          },
        },
      },
      initialRoute: walletRegisterRoutes.light,
    });

    container
      .get<Web3ManagerMock>(symbols.web3Manager)
      .initializeMock(internalWeb3AdapterMock, dummyNetworkId);

    const mountedComponent = createMount(
      wrapWithProviders(WalletSelector, {
        container,
        store,
        history,
      }),
    );

    // ensure that ledger tab is selected
    mountedComponent
      .find(tid("wallet-selector-ledger"))
      .find("a")
      .simulate("click", { button: 0 });

    await waitForTid(mountedComponent, "ledger-wallet-error-msg");

    expect(mountedComponent.find(tid("ledger-wallet-error-msg")).text()).to.be.eq(
      "Ledger Nano S is not available",
    );

    // simulate successful connection
    ledgerWalletConnectorMock.reMock({
      connect: async () => {},
      testConnection: async () => true,
      getMultipleAccounts: async () => ({
        [expectedDerivationPath]: "0x12345123123",
      }),
      finishConnecting: async () => {
        return ledgerWalletMock;
      },
    });
    ledgerWalletMock.reMock({
      testConnection: async () => true,
      signMessage: async mess => dummySign(mess),
    });
    globalFakeClock.tick(LEDGER_RECONNECT_INTERVAL);

    await waitForTid(mountedComponent, "wallet-ledger-accounts-table-body");

    // select one of the addresses
    mountedComponent
      .find(`${tid("button-select")}`)
      .first()
      .simulate("click");

    await waitForPredicate(
      () => dispatchSpy.calledWith(actions.routing.goToDashboard()),
      "Navigation to dashboard action",
    );

    expect(ledgerWalletConnectorMock.finishConnecting).to.be.calledOnce;
    expect(ledgerWalletConnectorMock.finishConnecting).to.be.calledWithExactly(
      expectedDerivationPath,
    );
    expect(dispatchSpy).calledWithExactly(
      actions.web3.newPersonalWalletPlugged(
        {
          walletType: EWalletType.LEDGER,
          walletSubType: EWalletSubType.UNKNOWN,
          derivationPath: expectedDerivationPath,
          address: expectedAddress,
        },
        true,
      ),
    );
    expect(ledgerWalletMock.signMessage).to.be.calledOnce;
    expect(ledgerWalletMock.signMessage).to.be.calledWithExactly(expectedChallenge);
    expect(signatureAuthApiMock.createJwt).to.be.calledOnce;
    expect(signatureAuthApiMock.createJwt).to.be.calledWithExactly(
      expectedChallenge,
      dummySign(expectedChallenge),
      SignerType.ETH_SIGN,
    );
  });

  it("should select browser wallet", async () => {
    const expectedAddress = dummyEthereumAddress;
    const expectedChallenge = "CHALLENGE";
    const browserWalletMock = createMock(BrowserWallet, {
      walletType: EWalletType.BROWSER,
      walletSubType: EWalletSubType.METAMASK,
      ethereumAddress: expectedAddress,
      getSignerType: () => SignerType.ETH_SIGN_TYPED_DATA,
      getMetadata: (): IBrowserWalletMetadata => ({
        walletType: EWalletType.BROWSER,
        address: expectedAddress,
        walletSubType: EWalletSubType.METAMASK,
      }),
    });
    const browserWalletConnectorMock = createMock(BrowserWalletConnector, {
      connect: async () => {
        throw new BrowserWalletMissingError();
      },
    });
    const internalWeb3AdapterMock = createMock(Web3Adapter, {
      getBalance: async () => new BigNumber(1),
    });
    const signatureAuthApiMock = createMock(SignatureAuthApi, {
      challenge: async () => ({
        statusCode: 200,
        body: {
          challenge: expectedChallenge,
        },
      }),
      createJwt: async () => ({
        statusCode: 200,
        body: {
          jwt: "JWT",
        },
      }),
    });
    const usersApiMock = createMock(UsersApi, {
      me: async () => getDummyUser(browserWalletMock.getMetadata()),
      createAccount: async () => getDummyUser(browserWalletMock.getMetadata()),
    });

    const contractsMock = createMock(ContractsService, {
      identityRegistry: createMock(IdentityRegistry, {
        getClaims: (_userId: string) => Promise.resolve("01001110"),
      }),
    });

    const { store, container, dispatchSpy, history } = createIntegrationTestsSetup({
      browserWalletConnectorMock,
      signatureAuthApiMock,
      usersApiMock,
      contractsMock,
      initialRoute: appRoutes.register,
      initialState: {
        init: {
          smartcontractsInit: {
            done: true,
          },
        },
      },
    });
    container
      .get<Web3ManagerMock>(symbols.web3Manager)
      .initializeMock(internalWeb3AdapterMock, dummyNetworkId);

    const mountedComponent = createMount(
      wrapWithProviders(WalletSelector, {
        container,
        store,
        history,
      }),
    );

    // select wallet in browser tab is selected
    mountedComponent
      .find(tid("wallet-selector-browser"))
      .find("a")
      .simulate("click", { button: 0 });
    await waitForTid(mountedComponent, "browser-wallet-error-msg");

    // there is no wallet in browser (BrowserWallet thrown BrowserWalletMissingError)
    expect(mountedComponent.find(tid("browser-wallet-error-msg")).text()).to.be.eq(
      "We did not detect any Web3 wallet",
    );

    // wallet in browser is locked
    browserWalletConnectorMock.reMock({
      connect: async () => {
        throw new BrowserWalletLockedError();
      },
    });
    await globalFakeClock.tickAsync(BROWSER_WALLET_RECONNECT_INTERVAL);
    mountedComponent.update();

    expect(mountedComponent.find(tid("browser-wallet-error-msg")).text()).to.be.eq(
      "Your wallet seems to be locked — we can't access any accounts",
    );

    // connect doesn't throw which means there is web3 in browser
    browserWalletMock.reMock({
      testConnection: async () => true,
      signMessage: async mess => dummySign(mess),
    });
    browserWalletConnectorMock.reMock({
      connect: async () => browserWalletMock,
    });
    await globalFakeClock.tickAsync(BROWSER_WALLET_RECONNECT_INTERVAL);

    await waitForPredicate(
      () => dispatchSpy.calledWith(actions.routing.goToDashboard()),
      "Navigation to dashboard action",
    );

    expect(dispatchSpy).calledWithExactly(
      actions.web3.newPersonalWalletPlugged(
        {
          walletType: EWalletType.BROWSER,
          address: expectedAddress,
          walletSubType: EWalletSubType.METAMASK,
        },
        true,
      ),
    );
    expect(browserWalletMock.signMessage).to.be.calledOnce;
    expect(browserWalletMock.signMessage).to.be.calledWithExactly(expectedChallenge);
    expect(signatureAuthApiMock.createJwt).to.be.calledOnce;
    expect(signatureAuthApiMock.createJwt).to.be.calledWithExactly(
      expectedChallenge,
      dummySign(expectedChallenge),
      SignerType.ETH_SIGN_TYPED_DATA,
    );
  });
});

function dummySign(mess: string): string {
  return `SIGNED: ${mess}`;
}
