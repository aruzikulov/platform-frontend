import { expect } from "chai";
import { spy } from "sinon";
import { dummyConfig, dummyEthereumAddress, dummyNetworkId } from "../../../test/fixtures";
import { globalFakeClock } from "../../../test/setupTestsHooks";
import { createMock, expectToBeRejected } from "../../../test/testUtils";
import { web3Actions } from "../../modules/web3/actions";
import { web3Flows } from "../../modules/web3/flows";
import { EWalletSubType, EWalletType } from "../../modules/web3/types";
import {
  AsyncIntervalScheduler,
  AsyncIntervalSchedulerFactoryType,
} from "../../utils/AsyncIntervalScheduler";
import { delay } from "../../utils/delay";
import { noopLogger } from "../dependencies/Logger";
import { ILedgerWalletMetadata } from "../persistence/WalletMetadataObjectStorage";
import { LedgerWallet } from "./LedgerWallet";
import {
  WalletNotConnectedError,
  WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL,
  Web3Manager,
} from "./Web3Manager";

describe("Web3Manager", () => {
  const expectedNetworkId = dummyNetworkId;

  it("should plug personal wallet when connection works", async () => {
    const expectedDerivationPath = "44'/60'/0'/1";
    const dispatchMock = spy();
    const ledgerWalletMock = createMock(LedgerWallet, {
      ethereumAddress: dummyEthereumAddress,
      testConnection: async () => true,
      walletType: EWalletType.LEDGER,
      walletSubType: EWalletSubType.UNKNOWN,
      derivationPath: expectedDerivationPath,
      getMetadata: (): ILedgerWalletMetadata => ({
        walletType: EWalletType.LEDGER,
        walletSubType: EWalletSubType.UNKNOWN,
        derivationPath: expectedDerivationPath,
        address: dummyEthereumAddress,
      }),
    });
    const asyncIntervalSchedulerMock = createMock(AsyncIntervalScheduler, {
      start: () => {},
    });
    const asyncIntervalSchedulerFactoryMock = () => asyncIntervalSchedulerMock;

    const web3Manager = new Web3Manager(
      dummyConfig.ethereumNetwork,
      dispatchMock,
      noopLogger,
      asyncIntervalSchedulerFactoryMock,
    );
    web3Manager.networkId = expectedNetworkId;

    await web3Manager.plugPersonalWallet(ledgerWalletMock);

    expect(web3Manager.personalWallet).to.be.eq(ledgerWalletMock);
    expect(ledgerWalletMock.testConnection).to.be.calledWithExactly(expectedNetworkId);
    expect(dispatchMock).to.be.calledWithExactly(
      web3Actions.newPersonalWalletPlugged(
        {
          address: dummyEthereumAddress,
          walletType: EWalletType.LEDGER,
          walletSubType: EWalletSubType.UNKNOWN,
          derivationPath: expectedDerivationPath,
        },
        true,
      ),
    );
    expect(asyncIntervalSchedulerMock.start).to.be.calledOnce;
  });

  it("should throw when plugging not connected wallet", async () => {
    const dispatchMock = spy();
    const ledgerWalletMock = createMock(LedgerWallet, {
      testConnection: async () => false,
      getMetadata: () =>
        ({
          walletType: EWalletType.LEDGER,
        } as any),
    });
    const asyncIntervalSchedulerMock = createMock(AsyncIntervalScheduler, {
      start: () => {},
    });
    const asyncIntervalSchedulerFactoryMock = () => asyncIntervalSchedulerMock;

    const web3Manager = new Web3Manager(
      dummyConfig.ethereumNetwork,
      dispatchMock,
      noopLogger,
      asyncIntervalSchedulerFactoryMock,
    );
    web3Manager.networkId = expectedNetworkId;

    await expectToBeRejected(
      () => web3Manager.plugPersonalWallet(ledgerWalletMock),
      new WalletNotConnectedError(ledgerWalletMock),
    );

    expect(web3Manager.personalWallet).to.be.eq(undefined);
    expect(ledgerWalletMock.testConnection).to.be.calledWithExactly(expectedNetworkId);
  });

  it("should watch connection status", async () => {
    const dispatchMock = spy();
    const ledgerWalletMock = createMock(LedgerWallet, {
      testConnection: async () => true,
      getMetadata: () =>
        ({
          walletType: EWalletType.LEDGER,
        } as any),
    });
    const asyncIntervalSchedulerFactory: AsyncIntervalSchedulerFactoryType = (cb, interval) =>
      new AsyncIntervalScheduler(noopLogger, cb, interval);

    const web3Manager = new Web3Manager(
      dummyConfig.ethereumNetwork,
      dispatchMock,
      noopLogger,
      asyncIntervalSchedulerFactory,
    );
    web3Manager.networkId = expectedNetworkId;

    await web3Manager.plugPersonalWallet(ledgerWalletMock);

    expect(ledgerWalletMock.testConnection).to.be.calledOnce;

    await globalFakeClock.tickAsync(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL);
    expect(ledgerWalletMock.testConnection).to.be.calledTwice;

    ledgerWalletMock.reMock({
      testConnection: async () => false,
    });
    await globalFakeClock.tickAsync(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL);
    expect(ledgerWalletMock.testConnection).to.be.calledOnce; // remocking resets counter
    expect(dispatchMock).to.be.calledWithExactly(web3Flows.personalWalletDisconnected);
  });

  it("should fail on connection timeout", async () => {
    const dispatchMock = spy();
    const ledgerWalletConnectionMock = createMock(LedgerWallet, {
      testConnection: async () => true,
      getMetadata: () =>
        ({
          walletType: EWalletType.LEDGER,
        } as any),
    });
    const asyncIntervalSchedulerFactory: AsyncIntervalSchedulerFactoryType = (cb, interval) =>
      new AsyncIntervalScheduler(noopLogger, cb, interval);

    const web3Manager = new Web3Manager(
      dummyConfig.ethereumNetwork,
      dispatchMock,
      noopLogger,
      asyncIntervalSchedulerFactory,
    );
    web3Manager.networkId = expectedNetworkId;

    await web3Manager.plugPersonalWallet(ledgerWalletConnectionMock);

    expect(ledgerWalletConnectionMock.testConnection).to.be.calledOnce;

    await globalFakeClock.tickAsync(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL);
    expect(ledgerWalletConnectionMock.testConnection).to.be.calledTwice;

    // make personal wallet timeout
    ledgerWalletConnectionMock.reMock({
      testConnection: async () => {
        await delay(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL * 2);
        return false;
      },
    });
    // run testConnection again
    await globalFakeClock.tickAsync(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL);
    // wait until timeout
    await globalFakeClock.tickAsync(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL);

    expect(ledgerWalletConnectionMock.testConnection).to.be.calledOnce;
    expect(dispatchMock).to.be.calledTwice;
    expect(dispatchMock).to.be.calledWithExactly(web3Flows.personalWalletDisconnected);
  });
});
