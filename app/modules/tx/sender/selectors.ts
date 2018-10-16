import { IAppState } from "../../../store";
import { getTxGasCostEth } from "../utils";
import { ITxSenderState } from "./reducer";

export const selectTxSenderModalOpened = (state: ITxSenderState) => state.state !== "UNINITIALIZED";

export const selectTxDetails = (state: ITxSenderState) => state.txDetails;

export const selectTxDraftDetails = (state: IAppState) => state.txSender.txDraftDetails;

export const selectTxType = (state: ITxSenderState) => state.type;

export const selectTxSummaryData = (state: ITxSenderState) => state.summaryData || state.txDetails;

export const selectTxGasCostEth = (state: ITxSenderState) => {
  const details = selectTxDetails(state);
  return details ? getTxGasCostEth(details) : "0";
};
