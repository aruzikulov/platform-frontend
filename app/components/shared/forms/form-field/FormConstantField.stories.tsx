import { storiesOf } from "@storybook/react";
import * as React from "react";

import { formWrapper } from "./form-utils";
import { FormConstantField } from "./FormConstantField";

storiesOf("Form/ConstantField", module).add(
  "default",
  formWrapper({ car: "bmw" })(() => <FormConstantField value="test" />),
);
