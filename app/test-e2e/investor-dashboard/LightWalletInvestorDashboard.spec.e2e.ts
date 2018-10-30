import { createAndLoginNewUser } from "../utils/userHelpers";
import { tid, assertDashboard } from "../utils";
describe("Auto Login", () => {
  it("will auto login", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      cy.visit("/dashboard");
      // just a basic check wether the dashboard is working
      assertDashboard();
    });
  });
});
