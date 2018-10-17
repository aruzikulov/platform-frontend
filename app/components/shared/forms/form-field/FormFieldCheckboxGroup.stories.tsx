import { storiesOf } from "@storybook/react";
import * as React from "react";
import { formWrapper } from "./form-utils";

import { FormFieldCheckbox, FormFieldCheckboxGroup } from "./FormFieldCheckboxGroup";

storiesOf("Form/FieldCheckboxGroup", module).add(
  "default",
  formWrapper({ animals: ["dog"] })(() => (
    <FormFieldCheckboxGroup name="animals">
      <h1>Checkbox group</h1>
      <FormFieldCheckbox value="dog" label="Dog" />
      <FormFieldCheckbox value="cat" label="Cat" />
    </FormFieldCheckboxGroup>
  )),
);
