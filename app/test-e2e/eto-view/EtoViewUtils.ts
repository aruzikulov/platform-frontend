import { tid } from "../utils";

export const assertEtoView = () => {
  cy.get(tid("eto.public-view")).should("exist");
};
