import { createSimpleAction } from "../actionsUtils";

export const depositModalActions = {
  showDepositEthModal: () => createSimpleAction("DEPOSIT_ETH_MODAL_SHOW"),
  hideDepositEthModal: () => createSimpleAction("DEPOSIT_ETH_MODAL_HIDE"),
};
