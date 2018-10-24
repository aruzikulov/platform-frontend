import { storiesOf } from "@storybook/react";
import * as React from "react";

import { formWrapper } from "./form-utils";
import { FormCategoryDistribution } from "./FormCategoryDistribution";

storiesOf("Form/CategoryDistribution", module)
  .add(
    "default",
    formWrapper({})(() => (
      <FormCategoryDistribution
        label="HOW WILL YOU USE THE RAISED CAPITAL?"
        name="test"
        paragraphName="paragraph"
        suggestions={["suggestion1", "suggestion2", "suggestion3"]}
        blankField={{
          description: "",
          percent: 0,
        }}
      />
    )),
  )
  .add(
    "Pre-filled Data",
    formWrapper({
      test: [
        { description: "Important Category", percent: "10" },
        { description: "ESOP", percent: "30" },
      ],
    })(() => (
      <FormCategoryDistribution
        transformRatio={100}
        label="HOW WILL YOU USE THE RAISED CAPITAL?"
        name="test"
        paragraphName="paragraph"
        suggestions={["suggestion1", "suggestion2", "suggestion3"]}
        blankField={{
          description: "",
          percent: 0,
        }}
      />
    )),
  );
