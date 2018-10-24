import * as cn from "classnames";
import { FormikConsumer } from "formik";
import { isFunction } from "lodash";
import * as React from "react";

import { CommonHtmlProps } from "../../../../types";
import { getFieldSchema, isRequired } from "../../../../utils/yupUtils";

import * as styles from "./FormLabel.module.scss";

export type FormLabelExternalProps = {
  name: string;
};

const FormLabelRaw: React.SFC<CommonHtmlProps> = ({ children, className }) => (
  <div className={cn(styles.formLabel, className)}>{children}</div>
);

const FormLabel: React.SFC<CommonHtmlProps & FormLabelExternalProps> = ({
  children,
  name,
  ...rawProps
}) => {
  return (
    <FormikConsumer>
      {({ validationSchema }) => {
        if (validationSchema) {
          const schema = isFunction(validationSchema) ? validationSchema() : validationSchema;

          const fieldSchema = getFieldSchema(name, schema);
          const required = isRequired(fieldSchema);

          return (
            <FormLabelRaw {...rawProps}>
              {children}
              {required && " *"}
            </FormLabelRaw>
          );
        }

        return <FormLabelRaw {...rawProps}>{children}</FormLabelRaw>;
      }}
    </FormikConsumer>
  );
};

export { FormLabel, FormLabelRaw };
