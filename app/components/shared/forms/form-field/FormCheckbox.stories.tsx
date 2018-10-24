import { storiesOf } from "@storybook/react";
import * as React from "react";

import { formWrapper } from "./form-utils";

import { FormCheckbox, FormRadioButton } from "./FormCheckbox";

storiesOf("Form/ Checkbox && RadioButton", module)
  .add(
    "checkbox",
    formWrapper({ bwm: false, audi: false, ford: true, volvo: true })(() => (
      <>
        <FormCheckbox name="bmw" label="bmw" />
        <FormCheckbox name="audi" label="audi" />
        <FormCheckbox name="ford" label="ford" />
        <FormCheckbox name="volvo" label="volvo" />
      </>
    )),
  )
  .add(
    "checkbox with long labels",
    formWrapper({ bwm: false, audi: false, ford: true, volvo: true })(() => (
      <>
        <div className="form-group">
          <FormCheckbox
            name="bmw"
            label=" No shareholder loans exist and at Closing Date the Company does not have any outstanding liabilities vis-à-vis Existing Shareholders or related parties. asdf asdf asdf asdf asdf asdf asdf l(kj(lkj asdf asdf as df asdf)) bmw"
          />
        </div>
        <div className="form-group">
          <FormCheckbox name="bmw" label="bmw" />
          <FormCheckbox name="audi" label="audi" />
          <FormCheckbox name="ford" label="ford" />
          <FormCheckbox name="volvo" label="volvo" />
          <FormCheckbox
            name="bmw"
            label=" No shareholder loans exist and at Closing Date the Company does not have any outstanding liabilities vis-à-vis Existing Shareholders or related parties. asdf asdf asdf asdf asdf asdf asdf l(kj(lkj asdf asdf as df asdf)) bmw"
          />
        </div>
      </>
    )),
  )
  .add(
    "radio button",
    formWrapper({ car: "bmw" })(() => (
      <>
        <FormRadioButton name="car" value="bmw" label="bmw" />
        <FormRadioButton name="car" value="audi" label="audi" />
        <FormRadioButton name="car" value="ford" label="ford" />
        <FormRadioButton name="car" value="volvo" label="volvo" />
      </>
    )),
  );
