import { tid } from "../../../test/testUtils";
import { appRoutes } from "../../components/appRoutes";
import { withParams } from "../../utils/withParams";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertEtoView } from "./EtoViewUtils";

const ETO_ID = "0x0d69BfC43EB3500A8A747Df979C22e3609B62A20";

describe("Eto Investor View", () => {
  beforeEach(() => createAndLoginNewUser({ type: "investor", kyc: "business" }));

  it("should load empty Eto", () => {
    cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));
    assertEtoView();
  });

  it("should display correct eto investment terms", () => {
    cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));
    assertEtoView();

    // EQUITY section
    cy.get(tid("eto-public-view-pre-money-valuation")).should("contain", "€132 664 672.0464");
    cy.get(tid("eto-public-view-existing-shares")).should("contain", "40 976");
    cy.get(tid("eto-public-view-new-shares-to-issue")).should("contain", "1000 - 3452");
    cy.get(tid("eto-public-view-new-shares-to-issue-in-whitelist")).should("contain", "1534");
    cy.get(tid("eto-public-view-new-share-price")).should("contain", "€3 237.6189");
    cy.get(tid("eto-public-view-whitelist-discount")).should("contain", "30%");
    cy.get(tid("eto-public-view-investment-amount")).should("contain", "€2.2 - 9.6 millions");

    // TOKEN SALE section
    cy.get(tid("eto-public-view-tokens-per-share")).should("contain", "10 000");
    cy.get(tid("eto-public-view-token-price")).should("contain", "€0.32376189");
    cy.get(tid("eto-public-view-ticket-size")).should("contain", "€100 - 10000000");
    cy.get(tid("eto-public-view-currencies")).should("contain", "ETH and nEUR");
    cy.get(tid("eto-public-view-pre-eto-duration")).should("contain", "7 Days");
    cy.get(tid("eto-public-view-public-eto-duration")).should("contain", "14 Days");

    // TOKEN HOLDER RIGHTS section
    cy.get(tid("eto-public-view-nominee")).should("contain", "Neumini UG");
    cy.get(tid("eto-public-view-public-offer-duration")).should("contain", "14 Days");
    cy.get(tid("eto-public-view-token-tradability")).should("contain", "Enabled");
    cy.get(tid("eto-public-view-voting-rights")).should("contain", "Yes");
    cy.get(tid("eto-public-view-liquidation-preference")).should("contain", "0x");
  });
});
