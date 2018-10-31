import { ITxData } from "../../../lib/web3/types";
import { createAction, createSimpleAction } from "../../actionsUtils";
import { ETxSenderType } from "./../interfaces";
import { ETransactionErrorType } from "./reducer";

export const txSenderActions = {
  // Modal related actions
  txSenderShowModal: (type: ETxSenderType) => createAction("TX_SENDER_SHOW_MODAL", { type }),
  txSenderHideModal: () => createSimpleAction("TX_SENDER_HIDE_MODAL"),
  // User awaiting actions
  txSenderAcceptDraft: (txDraftData?: Partial<ITxData>) =>
    createAction("TX_SENDER_ACCEPT_DRAFT", txDraftData!),
  txSenderAccept: () => createSimpleAction("TX_SENDER_ACCEPT"),
  txSenderChange: (type: ETxSenderType) => createAction("TX_SENDER_CHANGE", { type }),
  // Signer actions
  txSenderSigned: (txHash: string, type: ETxSenderType) =>
    createAction("TX_SENDER_SIGNED", { txHash, type }),
  txSenderWalletPlugged: () => createSimpleAction("TX_SENDER_WALLET_PLUGGED"),
  // Block mining actions
  txSenderReportBlock: (blockId: number) => createAction("TX_SENDER_REPORT_BLOCK", blockId),
  txSenderTxMined: () => createSimpleAction("TX_SENDER_TX_MINED"),
  // Pending transaction related actions
  txSenderWatchPendingTxs: () => createSimpleAction("TX_SENDER_WATCH_PENDING_TXS"),
  txSenderWatchPendingTxsDone: (type: ETxSenderType) =>
    createAction("TX_SENDER_WATCH_PENDING_TXS_DONE", { type }),
  // Error Actions
  txSenderError: (error: ETransactionErrorType) => createAction("TX_SENDER_ERROR", { error }),

  // reducer setters
  setSummaryData: (summaryData: Partial<ITxData>) =>
    createAction("TX_SENDER_SET_SUMMARY_DATA", summaryData),
  setTransactionData: (txData: ITxData) => createAction("TX_SENDER_LOAD_TRANSACTION", txData),
};
