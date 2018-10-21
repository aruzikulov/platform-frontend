import { expect } from "chai";
import { delay } from "redux-saga";
import { call, put } from "redux-saga/effects";

import { createMock } from "../../../test/testUtils";
import { LIGHT_WALLET_PASSWORD_CACHE_TIME } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { noopLogger } from "../../lib/dependencies/Logger";
import { Web3Manager } from "../../lib/web3/Web3Manager";
import { actions } from "../actions";
import { autoLockLightWallet } from "./sagas";

describe("Web3 sagas", () => {
  describe("light wallet password", () => {
    it("should reset password after timeout", () => {
      const personalWalletMock = {
        password: "some dummy pass",
      } as any;
      const web3ManagerMock = createMock(Web3Manager, {
        personalWallet: personalWalletMock,
      });
      const saga = autoLockLightWallet(({
        web3Manager: web3ManagerMock,
        logger: noopLogger,
      } as any) as TGlobalDependencies);

      expect(saga.next().value).to.be.deep.eq(call(delay, LIGHT_WALLET_PASSWORD_CACHE_TIME));
      expect(saga.next().value).to.be.deep.eq(put(actions.web3.walletLocked()));
      expect(saga.next().value).to.be.deep.eq(put(actions.web3.clearSeedFromState()));
      expect(saga.next().value).to.be.undefined;
      expect(personalWalletMock.password).to.be.undefined;
    });
  });
});
