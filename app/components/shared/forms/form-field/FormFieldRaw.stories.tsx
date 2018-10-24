import { storiesOf } from "@storybook/react";
import * as React from "react";

import { FormFieldRaw } from "./FormFieldRaw";

storiesOf("Form/FormFieldRaw", module)
  .add("default", () => <FormFieldRaw label="Form field" name="value" />)
  .add("with suffix", () => <FormFieldRaw label="Form field" name="value" suffix="%" />)
  .add("with prefix", () => <FormFieldRaw label="Form field" name="value" prefix="@" />)
  .add("with error message", () => (
    <FormFieldRaw
      label="Form field"
      name="value"
      errorMsg="something is wrong"
      suffix="fufu"
      prefix="€"
    />
  ));
