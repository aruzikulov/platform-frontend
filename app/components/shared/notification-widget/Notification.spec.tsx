import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { NotificationType } from "../../../modules/notifications/reducer";
import { INotificationProps, Notification } from "./Notification";

import { tid } from "../../../../test/testUtils";

const defaultProps = (): INotificationProps => ({
  type: NotificationType.INFO,
  text: "test notification",
  onClick: spy(),
  actionLinkText: "link text",
});

describe("<Notification />", () => {
  let props: any;

  beforeEach(() => {
    props = defaultProps();
  });

  it("should be of correct type", () => {
    const componentInfo = shallow(<Notification {...props} type={NotificationType.INFO} />);

    expect(componentInfo.render().hasClass(NotificationType.INFO)).to.be.true;

    const componentWarning = shallow(<Notification {...props} type={NotificationType.WARNING} />);

    expect(componentWarning.render().hasClass(NotificationType.WARNING)).to.be.true;
  });

  it("should call correct click handlers for close button", () => {
    const component = shallow(<Notification {...props} />);

    component
      .dive()
      .find(tid("notification-close"))
      .first()
      .simulate("click");

    expect(props.onClick).to.be.calledOnce;
  });
});
