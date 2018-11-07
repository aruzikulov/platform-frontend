import { appRoutes } from "../../components/appRoutes";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertEtoView } from "./EtoViewUtils";

describe("Eto Issuer View", () => {
  it("should load empty Eto", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(() => {
      cy.visit(appRoutes.etoIssuerView);
      assertEtoView();
    });
  });
});
