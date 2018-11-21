import { tid } from "../../../test/testUtils";
import { fillForm } from "../utils/forms";

describe("Landing", () => {
  it("should work", () => {
    cy.visit("/");

    cy.title().should("eq", "Neufund Platform");
    cy.get(tid("landing-page")).should("exist");
  });

  it("should subscribe to newsletter", () => {
    cy.visit("/");

    fillForm({
      "landing-header-join-cta-newsletter-email": "test@email.com",
      "landing-header-join-cta-newsletter-subscribe": { type: "submit" },
    });

    cy.get(tid("landing-header-join-cta-newsletter-check-email")).should("exist");
  });

  it("should show error message while subscribing to newsletter", () => {
    cy.visit("/");

    fillForm({
      "landing-header-join-cta-newsletter-email": "invalid-email",
      "landing-header-join-cta-newsletter-subscribe": { type: "submit" },
    });

    cy.get(tid("landing-header-join-cta-newsletter-error")).should("exist");
  });

  it("should show success message when subscribed to newsletter", () => {
    cy.visit("/?subscribe=success");

    cy.get(tid("landing-header-join-cta-newsletter-subscribed")).should("exist");
  });

  it("should show error message when failed to subscribed for a newsletter", () => {
    cy.visit("/?subscribe=no-success");

    cy.get(tid("landing-header-join-cta-newsletter-failed-to-subscribe")).should("exist");
  });
});
