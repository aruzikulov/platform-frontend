import { expect } from "chai";
import { spy } from "sinon";
import { dummyEthereumAddress, dummyNetworkId } from "../../../../test/fixtures";
import { createMock } from "../../../../test/testUtils";
import { noopLogger } from "../../../lib/dependencies/Logger";
import { IBrowserWalletMetadata } from "../../../lib/persistence/WalletMetadataObjectStorage";
import {
  BrowserWallet,
  BrowserWalletConnector,
  BrowserWalletLockedError,
} from "../../../lib/web3/BrowserWallet";
import { Web3Manager } from "../../../lib/web3/Web3Manager";
import { IAppState } from "../../../store";
import { actions } from "../../actions";
import { EWalletSubType, EWalletType } from "../../web3/types";
import { walletFlows } from "../flows";

// tslint:disable: no-object-literal-type-assertion
const getStateMock: () => IAppState = () =>
  <IAppState>{
    browserWalletWizardState: {
      approvalRejected: false,
    },
  };
/* tslint:enable:no-object-literal-type-assertion */

describe("Wallet selector > Browser wizard > actions", () => {
  describe("tryConnectingWithBrowserWallet action", () => {
    it("should plug wallet on successful connection", async () => {
      const expectedNetworkId = dummyNetworkId;
      const dummyMetadata: IBrowserWalletMetadata = {
        address: dummyEthereumAddress,
        walletType: EWalletType.BROWSER,
        walletSubType: EWalletSubType.METAMASK,
      };

      const dispatchMock = spy();
      const browserWalletMock = createMock(BrowserWallet, {
        getMetadata: () => dummyMetadata,
      });
      const browserWalletConnectorMock = createMock(BrowserWalletConnector, {
        connect: async () => browserWalletMock,
      });
      const web3ManagerMock = createMock(Web3Manager, {
        networkId: expectedNetworkId,
        plugPersonalWallet: async () => {},
      });

      await walletFlows.tryConnectingWithBrowserWallet(
        dispatchMock,
        browserWalletConnectorMock,
        web3ManagerMock,
        noopLogger,
        getStateMock,
      );
      expect(browserWalletConnectorMock.connect).to.be.calledWithExactly(expectedNetworkId);
      expect(dispatchMock).to.be.calledWithExactly(actions.walletSelector.connected());
    });

    it("should dispatch error action on error", async () => {
      const expectedNetworkId = dummyNetworkId;

      const dispatchMock = spy();
      const browserWalletConnectorMock = createMock(BrowserWalletConnector, {
        connect: async () => {
          throw new BrowserWalletLockedError();
        },
      });
      const web3ManagerMock = createMock(Web3Manager, {
        networkId: expectedNetworkId,
        plugPersonalWallet: async () => {},
      });

      await walletFlows.tryConnectingWithBrowserWallet(
        dispatchMock,
        browserWalletConnectorMock,
        web3ManagerMock,
        noopLogger,
        getStateMock,
      );

      expect(browserWalletConnectorMock.connect).to.be.calledWithExactly(expectedNetworkId);
      expect(dispatchMock).to.be.calledWithExactly(
        actions.walletSelector.browserWalletConnectionError(
          "Your wallet seems to be locked — we can't access any accounts",
        ),
      );
    });
  });
});
