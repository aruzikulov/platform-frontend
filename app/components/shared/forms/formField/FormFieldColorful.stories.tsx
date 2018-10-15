import { storiesOf } from "@storybook/react";
import { Form, Formik } from "formik";
import * as React from "react";

import { FormFieldColorful } from "./FormFieldColorful";

storiesOf("Form/FormFieldColorful", module)
  .add("default", () => (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {() => (
        <Form>
          <FormFieldColorful placeholder="Form field colorful" name="value" />
        </Form>
      )}
    </Formik>
  ))
  .add("with Avatar", () => (
    <Formik
      initialValues={{
        value: "Lorem ipsum",
      }}
      onSubmit={() => {}}
    >
      {() => (
        <Form>
          <FormFieldColorful placeholder="Form field colorful" name="value" showAvatar={true} />
        </Form>
      )}
    </Formik>
  ));
