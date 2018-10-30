import { appRoutes } from "../../components/appRoutes";
import { tid } from "../utils";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Eto Issuer View", () => {
  it("should load empty Eto", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(() => {
      cy.visit(appRoutes.etoIssuerView);
      cy.get(tid("eto.public-view")).should("exist");
    });
  });
});
