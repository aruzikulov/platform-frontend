import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { spy } from "sinon";
import { submit } from "../../../../../test/integrationTestUtils";
import { tid } from "../../../../../test/testUtils";
import { formWrapper } from "./form-utils";
import { FormToggle } from "./FormToggle";

describe("Toggle", () => {
  const TRUE_VALUE = "TRUE VALUE";
  const FALSE_VALUE = "FALSE VALUE";

  it("should toggle true value", async () => {
    const submitFormHandler = spy();

    const Component = formWrapper({ toggle: TRUE_VALUE }, submitFormHandler)(() => (
      <FormToggle
        name="toggle"
        enabledLabel="on"
        disabledLabel="off"
        trueValue={TRUE_VALUE}
        falseValue={FALSE_VALUE}
        data-test-id="component"
      />
    ));
    const component = mount(<Component />);

    component
      .find(tid("component"))
      .last()
      .simulate("change", { target: { checked: false } });

    await submit(component);

    expect(submitFormHandler).to.be.calledOnce;
    expect(submitFormHandler).to.be.calledWith({ toggle: FALSE_VALUE });
  });

  it("should toggle false value", async () => {
    const submitFormHandler = spy();

    const Component = formWrapper({ toggle: FALSE_VALUE }, submitFormHandler)(() => (
      <FormToggle
        name="toggle"
        enabledLabel="on"
        disabledLabel="off"
        trueValue={TRUE_VALUE}
        falseValue={FALSE_VALUE}
        data-test-id="component"
      />
    ));
    const component = mount(<Component />);

    component
      .find(tid("component"))
      .last()
      .simulate("change", { target: { checked: true } });

    await submit(component);

    expect(submitFormHandler).to.be.calledOnce;
    expect(submitFormHandler).to.be.calledWith({ toggle: TRUE_VALUE });
  });

  it("should set default value", async () => {
    const submitFormHandler = spy();

    const Component = formWrapper({}, submitFormHandler)(() => (
      <FormToggle
        name="toggle"
        enabledLabel="on"
        disabledLabel="off"
        trueValue={TRUE_VALUE}
        falseValue={FALSE_VALUE}
        data-test-id="component"
      />
    ));
    const component = mount(<Component />);

    await submit(component);

    expect(submitFormHandler).to.be.calledOnce;
    expect(submitFormHandler).to.be.calledWith({ toggle: FALSE_VALUE });
  });
});
