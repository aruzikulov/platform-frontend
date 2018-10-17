import { appRoutes } from "../../components/appRoutes";
import { tid } from "../utils";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Eto Issuer View", () => {
  beforeEach(() => createAndLoginNewUser({ type: "issuer", kyc: "business" }));
  it("should load empty Eto", () => {
    cy.visit(appRoutes.etoIssuerView);
    cy.get(tid("eto.public-view")).should("exist");
  });
});
