import { storiesOf } from "@storybook/react";
import * as React from "react";

import { formWrapper } from "./form-utils";
import { NumberTransformingField } from "./NumberTransformingField";

storiesOf("Form/TransformingField", module)
  .add(
    "with ratio",
    formWrapper({ name: 0.5 })(() => <NumberTransformingField name="name" ratio={100} />),
  )
  .add("no ratio", formWrapper({ name: 0.5 })(() => <NumberTransformingField name="name" />));
