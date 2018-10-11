import { multiplyBigNumbers } from "../../../utils/BigNumberUtils";
import { ITxData } from "./../../../lib/web3/Web3Manager";
import { ETxSenderType, ITxSenderState } from "./reducer";

export const selectTxSenderModalOpened = (state: ITxSenderState) => state.state !== "UNINITIALIZED";

export const selectTxDetails = (state: ITxSenderState) => state.txDetails;

export const selectTxType = (state: ITxSenderState) => state.type;

export const selectTxSummaryData = (state: ITxSenderState) => state.summaryData || state.txDetails;
