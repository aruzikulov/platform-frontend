import { createAction, createSimpleAction } from "../../actionsUtils";
import { ETokenType } from "../interfaces";

export const txTransactionsActions = {
  /* Transaction Flows */
  startWithdrawEth: () => createSimpleAction("TRANSACTIONS_START_WITHDRAW_ETH"),
  startUpgrade: (tokenType: ETokenType) => createAction("TRANSACTIONS_START_UPGRADE", tokenType),
  startInvestment: () => createSimpleAction("TRANSACTIONS_START_INVESTMENT"),
  // Add here new custom sagas that represent flows
};
