import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { tid } from "../../../../test/testUtils";
import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import { BackupSeedWidgetComponent } from "./BackupSeedWidget";

describe("<BackupSeedWidgetComponent />", () => {
  it("should render verified section", () => {
    const MyNeuWidgetComponent = shallow(
      <BackupSeedWidgetComponent backupCodesVerified step={1} intl={dummyIntl} />,
    );
    expect(MyNeuWidgetComponent.find(tid("backup-seed-unverified-section"))).to.have.length(0);
    expect(MyNeuWidgetComponent.find(tid("backup-seed-verified-section"))).to.have.length(1);
  });

  it("should render unverified section", () => {
    const MyNeuWidgetComponent = shallow(<BackupSeedWidgetComponent step={1} intl={dummyIntl} />);
    expect(MyNeuWidgetComponent.find(tid("backup-seed-unverified-section"))).to.have.length(1);
    expect(MyNeuWidgetComponent.find(tid("backup-seed-verified-section"))).to.have.length(0);
  });
});
