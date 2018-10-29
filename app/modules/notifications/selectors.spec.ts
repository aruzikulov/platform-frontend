import { expect } from "chai";

import { appRoutes } from "../../components/appRoutes";
import { IAppState } from "../../store";
import { DeepPartial } from "../../types";
import { selectIsVisibleSecurityNotification } from "./selectors";

describe("selectIsVisibleSecurityNotification", () => {
  it("should return false if KYC data is still loading", () => {
    const appState: DeepPartial<IAppState> = {
      kyc: {
        individualRequestStateLoading: false,
        businessRequestStateLoading: true,
      },
      router: {},
    };

    const actual = selectIsVisibleSecurityNotification(appState as any);

    expect(actual).to.be.false;
  });

  it("should return false if route is whitelisted", () => {
    const appState: DeepPartial<IAppState> = {
      kyc: {},
      router: {
        location: {
          pathname: appRoutes.kyc,
        },
      },
    };

    const actual = selectIsVisibleSecurityNotification(appState as any);

    expect(actual).to.be.false;
  });
});
