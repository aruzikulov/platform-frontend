import { acceptWallet, tid } from "../utils";

export const submitProposal = () => {
  cy.visit("/dashboard");

  cy.get(tid("eto-dashboard-submit-proposal")).click();
  acceptWallet();

  cy.get(tid("eto-state")).should("contain", "Proposal in review");
};
