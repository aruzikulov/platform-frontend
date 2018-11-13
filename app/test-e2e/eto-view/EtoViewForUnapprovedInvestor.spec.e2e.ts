import { tid } from "../../../test/testUtils";
import { appRoutes } from "../../components/appRoutes";
import { withParams } from "../../utils/withParams";
import { etoFixtureAddressByName } from "../utils";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertEtoView } from "./EtoViewUtils";

const ETO_ID = etoFixtureAddressByName("ETOInPublicState")!;

describe("Eto Investor View", () => {
  beforeEach(() => createAndLoginNewUser({ type: "investor" }));

  it("should show investment notification when kyc is not done", () => {
    cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));
    assertEtoView();

    cy.get(tid("eto-overview-settings-update-required-to-invest")).should("exist");
  });
});
