import { storiesOf } from "@storybook/react";
import { Form, Formik } from "formik";
import * as React from "react";

import { FormField } from "./FormField";

storiesOf("Form/Field", module)
  .add("default", () => (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {() => (
        <Form>
          <FormField label="Form field" name="value" />
        </Form>
      )}
    </Formik>
  ))
  .add("with suffix", () => (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {() => (
        <Form>
          <FormField label="Form field" name="value" suffix="%" />
        </Form>
      )}
    </Formik>
  ))
  .add("with prefix", () => (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {() => (
        <Form>
          <FormField label="Form field" name="value" prefix="@" />
        </Form>
      )}
    </Formik>
  ));
