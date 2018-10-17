import { storiesOf } from "@storybook/react";
import { Form, Formik } from "formik";
import * as React from "react";

import { FormFieldDatePicker } from "./FormFieldDatePicker";

storiesOf("Form/FieldDatePicker", module).add("default", () => (
  <Formik initialValues={{}} onSubmit={() => {}}>
    {() => (
      <Form>
        <FormFieldDatePicker name="name" />
      </Form>
    )}
  </Formik>
));
