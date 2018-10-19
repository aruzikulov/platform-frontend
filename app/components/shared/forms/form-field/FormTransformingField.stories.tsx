import { storiesOf } from "@storybook/react";
import * as React from "react";

import { formWrapper } from "./form-utils";
import { FormTransformingField } from "./FormTransformingField";

storiesOf("Form/TransformingField", module).add(
  "default",
  formWrapper({ name: 0.5 })(() => <FormTransformingField name="name" ratio={100} />),
);
