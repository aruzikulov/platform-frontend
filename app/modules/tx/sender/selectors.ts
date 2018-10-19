import { IAppState } from "../../../store";
import { multiplyBigNumbers } from "./../../../utils/BigNumberUtils";
import { ITxSenderState } from "./reducer";

export const selectTxSenderModalOpened = (state: ITxSenderState) => state.state !== "UNINITIALIZED";

export const selectTxDetails = (state: ITxSenderState) => state.txDetails;

export const selectTxDraftDetails = (state: IAppState) => state.txSender.txDraftDetails;

export const selectTxType = (state: ITxSenderState) => state.type;

export const selectTxSummaryData = (state: ITxSenderState) => state.summaryData || state.txDetails;

export const selectTxGasCostEth = (state: ITxSenderState) => {
  const gasPrice = (state.txDetails && state.txDetails.gasPrice) || "0";
  const gasLimit = (state.txDetails && state.txDetails.gas) || "0";
  return multiplyBigNumbers([gasPrice, gasLimit]);
};
