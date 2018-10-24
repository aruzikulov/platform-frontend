import { createAndLoginNewUser } from "../utils/userHelpers";
import { tid, assertDashboard } from "../utils";
describe("Auto Login", () => {
  beforeEach(() => createAndLoginNewUser({ type: "investor" }));

  it("will auto login", () => {
    cy.visit("/dashboard");
    // just a basic check wether the dashboard is working
    assertDashboard();
  });
});
