import * as cn from "classnames";
import { FormikConsumer, getIn } from "formik";
import { get } from "lodash";
import * as React from "react";
import { isNonValid } from "./utils";

import * as styles from "./FormStyles.module.scss";

export interface IProps {
  name: string;
  defaultMessage?: string;
  ignoreTouched?: boolean;
  className?: string;
}

const FormError: React.SFC<IProps> = ({ name, defaultMessage, ignoreTouched, className }) => (
  <FormikConsumer>
    {({ touched, errors, submitCount }) => {
      const touchedSubmitCountIncluded = {
        ...touched,
        [name]: get(touched, name) || submitCount > 0,
      };
      return (
        isNonValid(touchedSubmitCountIncluded, errors, name, ignoreTouched) && (
          <div
            data-test-id={`form.${name}.error-message`}
            className={cn(styles.errorLabel, className)}
          >
            {getIn(errors, name) || defaultMessage}
          </div>
        )
      );
    }}
  </FormikConsumer>
);

export { FormError };
