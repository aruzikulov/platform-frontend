import { tid } from "../utils";
import { DEFAULT_PASSWORD } from "../utils/userHelpers";

export const acceptWallet = () => {
  cy.get(tid("access-light-wallet-password-input")).type(DEFAULT_PASSWORD);
  cy.get(tid("access-light-wallet-confirm")).awaitedClick(1500);
};
