import { IAppState } from "../../../store";
import { multiplyBigNumbers } from "./../../../utils/BigNumberUtils";
import { ETxSenderState, EValidationState } from "./reducer";

export const selectTxSenderModalOpened = (state: IAppState) =>
  state.txSender.state !== ETxSenderState.UNINITIALIZED;

export const selectTxDetails = (state: IAppState) => state.txSender.txDetails;

export const selectTxType = (state: IAppState) => state.txSender.type;

export const selectTxSummaryData = (state: IAppState) =>
  state.txSender.summaryData || state.txSender.txDetails;

export const selectTxGasCostEth = (state: IAppState): string => {
  const details = selectTxDetails(state);
  const gasPrice = (details && details.gasPrice) || "0";
  const gasLimit = (details && details.gas) || "0";
  return multiplyBigNumbers([gasPrice, gasLimit]);
};

export const selectTxValidationState = (state: IAppState): EValidationState | undefined =>
  state.txSender.validationState;
