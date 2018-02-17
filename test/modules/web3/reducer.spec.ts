import { expect } from "chai";
import { actions } from "../../../app/modules/actions";
import { newPersonalWalletPluggedAction } from "../../../app/modules/web3/actions";
import { WalletSubType, WalletType } from "../../../app/modules/web3/PersonalWeb3";
import { IWeb3State, web3InitialState, web3Reducer } from "../../../app/modules/web3/reducer";
import { dummyEthereumAddress } from "../../fixtures";

describe("Web3 > reducer", () => {
  it("should act on NEW_PERSONAL_WALLET_PLUGGED action", () => {
    const initialState = web3InitialState;
    const actionPayload = {
      type: WalletType.BROWSER,
      subtype: WalletSubType.METAMASK,
      ethereumAddress: dummyEthereumAddress,
    };

    const actualNewState = web3Reducer(initialState, newPersonalWalletPluggedAction(actionPayload));

    expect(actualNewState).to.be.deep.eq({
      connected: true,
      type: actionPayload.type,
      subtype: actionPayload.subtype,
      ethereumAddress: dummyEthereumAddress,
    });
  });

  it("should act on PERSONAL_WALLET_DISCONNECTED when previously it was connected", () => {
    const initialState: IWeb3State = {
      connected: true,
      type: WalletType.BROWSER,
      subtype: WalletSubType.METAMASK,
      ethereumAddress: dummyEthereumAddress,
    };

    const actualNewState = web3Reducer(initialState, actions.web3.personalWalletDisconnected());

    expect(actualNewState).to.be.deep.eq({
      connected: false,
      previousConnectedWalletType: WalletType.BROWSER,
    });
  });

  it("should act on PERSONAL_WALLET_DISCONNECTED action", () => {
    const initialState = web3InitialState;

    const actualNewState = web3Reducer(initialState, actions.web3.personalWalletDisconnected());

    expect(actualNewState).to.be.deep.eq({
      connected: false,
      previousConnectedWalletType: undefined,
    });
  });
});
