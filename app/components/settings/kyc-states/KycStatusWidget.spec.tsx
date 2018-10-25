import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EUserType } from "../../../lib/api/users/interfaces";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { KycStatusWidgetComponent } from "./KycStatusWidget";

describe("<KycStatusWidgetComponent />", () => {
  it("should render verified section", () => {
    const component = shallow(
      <KycStatusWidgetComponent
        step={1}
        onGoToKycHome={() => {}}
        onGoToWallet={() => {}}
        requestStatus="Accepted"
        isUserEmailVerified={true}
        isLoading={false}
        userType={EUserType.INVESTOR}
      />,
    );

    expect(component.contains(<FormattedMessage id="settings.kyc-status-widget.status.accepted" />))
      .to.be.true;
  });

  it("should render unverified section", () => {
    const component = shallow(
      <KycStatusWidgetComponent
        step={1}
        onGoToKycHome={() => {}}
        onGoToWallet={() => {}}
        requestStatus="Draft"
        isUserEmailVerified={true}
        isLoading={false}
        userType={EUserType.INVESTOR}
      />,
    );

    expect(component.contains(<FormattedMessage id="settings.kyc-status-widget.status.draft" />)).to
      .be.true;
  });

  it("should render loading indicator", () => {
    const component = shallow(
      <KycStatusWidgetComponent
        step={1}
        onGoToKycHome={() => {}}
        onGoToWallet={() => {}}
        isUserEmailVerified={true}
        isLoading={true}
        userType={EUserType.INVESTOR}
      />,
    );
    expect(component.find(LoadingIndicator)).to.have.length(1);
  });
});
