import { expect } from "chai";
import { spy } from "sinon";

import { createMock } from "../../../test/testUtils";
import { NotificationCenter } from "../../lib/dependencies/NotificationCenter";
import { IAppState } from "../../store";
import { dummyIntl } from "../../utils/injectIntlHelpers.fixtures";
import {
  getDummyBrowserWalletMetadata,
  getDummyLedgerWalletMetadata,
  getDummyLightWalletMetadata,
} from "./fixtures";
import { web3Flows } from "./flows";

describe("web3 > flows", () => {
  describe("personalWalletDisconnected", () => {
    it("should send notification if it's ledger wallet", () => {
      const dummyDispatch = spy();
      const state: Partial<IAppState> = {
        web3: {
          connected: false,
          previousConnectedWallet: getDummyLedgerWalletMetadata(),
        },
      };

      const dummyNotificationCenter = createMock(NotificationCenter, {
        error: () => {},
      });

      web3Flows.personalWalletDisconnected(
        dummyDispatch,
        () => state as any,
        dummyNotificationCenter,
        { intl: dummyIntl },
      );

      expect(dummyNotificationCenter.error).to.be.calledOnce;
    });

    it("should send notification if it's browser wallet", () => {
      const dummyDispatch = spy();
      const state: Partial<IAppState> = {
        web3: {
          connected: false,
          previousConnectedWallet: getDummyBrowserWalletMetadata(),
        },
      };

      const dummyNotificationCenter = createMock(NotificationCenter, {
        error: () => {},
      });

      web3Flows.personalWalletDisconnected(
        dummyDispatch,
        () => state as any,
        dummyNotificationCenter,
        { intl: dummyIntl },
      );

      expect(dummyNotificationCenter.error).to.be.calledOnce;
    });

    it("should not send notification if it's light wallet", () => {
      const dummyDispatch = spy();
      const state: Partial<IAppState> = {
        web3: {
          connected: false,
          previousConnectedWallet: getDummyLightWalletMetadata(),
        },
      };
      const dummyNotificationCenter = createMock(NotificationCenter, {
        error: () => {},
      });

      web3Flows.personalWalletDisconnected(
        dummyDispatch,
        () => state as any,
        dummyNotificationCenter,
        { intl: dummyIntl },
      );

      expect(dummyNotificationCenter.error).not.to.be.called;
    });
  });
});
