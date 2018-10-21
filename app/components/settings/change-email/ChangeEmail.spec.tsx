import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";
import { tid } from "../../../../test/testUtils";
import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import { ChangeEmailComponent } from "./ChangeEmail";

describe("<ChangeEmailComponent />", () => {
  it("Should render Component", () => {
    const submitFormMock = spy();
    const MyNeuWidgetComponent = shallow(
      <ChangeEmailComponent submitForm={submitFormMock} intl={dummyIntl} />,
    );
    expect(MyNeuWidgetComponent.find(tid("paragraph-section"))).to.have.length(1);
    expect(MyNeuWidgetComponent.find(tid("form-section"))).to.have.length(1);
  });
});
