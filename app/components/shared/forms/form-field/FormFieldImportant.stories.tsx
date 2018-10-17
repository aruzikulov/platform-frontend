import { storiesOf } from "@storybook/react";
import { Form, Formik } from "formik";
import * as React from "react";

import { FormFieldImportant } from "./FormFieldImportant";

storiesOf("Form/FieldImportant", module)
  .add("default", () => (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {() => (
        <Form>
          <FormFieldImportant placeholder="Form field" name="value" />
        </Form>
      )}
    </Formik>
  ))
  .add("with validation error message", () => {
    const errorMessage = <div>There is an error</div>;
    return (
      <Formik initialValues={{ value: "sadf" }} onSubmit={() => {}}>
        {() => (
          <Form>
            <FormFieldImportant
              validate={() => "Wrong!!"}
              placeholder="Form field"
              name="value"
              errorMessage={errorMessage}
            />
          </Form>
        )}
      </Formik>
    );
  });
