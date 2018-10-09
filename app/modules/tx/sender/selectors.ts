import { multiplyBigNumbers } from "../../../utils/BigNumberUtils";
import { ITxData } from "./../../../lib/web3/Web3Manager";
import { ETxSenderType, ITxSenderState } from "./reducer";

export const selectTxSenderModalOpened = (state: ITxSenderState): boolean =>
  state.state !== "UNINITIALIZED";

export const selectTxDetails = (state: ITxSenderState): ITxData | undefined => state.txDetails;

export const selectTxType = (state: ITxSenderState): ETxSenderType | undefined => state.type;

export const selectTxGasCostEth = (state: ITxSenderState) =>
  multiplyBigNumbers([state.gasPrice, state.gasLimit]);
