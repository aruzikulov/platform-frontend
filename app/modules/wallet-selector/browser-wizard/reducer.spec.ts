import { expect } from "chai";
import { actions } from "../../actions";
import { browserWalletWizardReducer } from "./reducer";

describe("Wallet selector > Ledger wizard > reducer", () => {
  it("should act on BROWSER_WALLET_CONNECTION_ERROR action", () => {
    const expectedErrorMsg = "some error";

    const actualState = browserWalletWizardReducer(
      undefined,
      actions.walletSelector.browserWalletConnectionError(expectedErrorMsg),
    );

    expect(actualState).to.be.deep.eq({
      approval_rejected: false,
      isLoading: false,
      errorMsg: expectedErrorMsg,
    });
  });
});
