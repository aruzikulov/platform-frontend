import {
  assertBackupSeedWidgetVisible,
  assertEmailActivationWidgetVisible,
  assertEtoDashboard,
  convertToUniqueEmail,
  goToDashboard,
  registerWithLightWalletETO,
  verifyLatestUserEmail,
} from "../utils";
import { backupLightWalletSeed } from "../shared/backupLightWalletSeed";

const password = "strongpassword";

describe("Light Wallet ETO Dashboard", () => {
  it("should register verify an email and assert that the dashboard is changing", () => {
    const testEmail = convertToUniqueEmail("moe@test.com");

    registerWithLightWalletETO(testEmail, password);

    assertEtoDashboard();
    assertBackupSeedWidgetVisible();
    assertEmailActivationWidgetVisible();

    backupLightWalletSeed();
    goToDashboard();

    assertEtoDashboard();
    assertBackupSeedWidgetVisible(true);
    assertEmailActivationWidgetVisible();

    verifyLatestUserEmail();
    goToDashboard();

    assertEtoDashboard();
    assertEmailActivationWidgetVisible(true);
    assertBackupSeedWidgetVisible(true);
  });
});
