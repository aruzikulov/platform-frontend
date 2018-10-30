import { appRoutes } from "../../components/appRoutes";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertEtoView } from "./EtoViewUtils";

describe("Eto Issuer View", () => {
  beforeEach(() => createAndLoginNewUser({ type: "issuer", kyc: "business" }));
  it("should load empty Eto", () => {
    cy.visit(appRoutes.etoIssuerView);
    assertEtoView();
  });
});
