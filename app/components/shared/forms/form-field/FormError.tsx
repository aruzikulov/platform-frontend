import { FormikConsumer, getIn } from "formik";
import * as React from "react";

import { isNonValid } from "./utils";

import * as styles from "./FormStyles.module.scss";

export interface IProps {
  name: string;
  defaultMessage?: string;
  ignoreTouched?: boolean;
}

const FormError: React.SFC<IProps> = ({ name, defaultMessage, ignoreTouched }) => (
  <FormikConsumer>
    {({ touched, errors, submitCount }) => {
      const touchedSubmitCountIncluded = {
        ...touched,
        [name]: touched[name] || submitCount > 0,
      };
      return (
        isNonValid(touchedSubmitCountIncluded, errors, name, ignoreTouched) && (
          <div data-test-id={`form.${name}.error-message`} className={styles.errorLabel}>
            {getIn(errors, name) || defaultMessage}
          </div>
        )
      );
    }}
  </FormikConsumer>
);

export { FormError };
