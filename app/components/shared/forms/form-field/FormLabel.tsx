import * as cn from "classnames";
import { FormikConsumer } from "formik";
import * as React from "react";

import { CommonHtmlProps } from "../../../../types";
import { isFieldRequired } from "./utils";

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
          return (
            <FormLabelRaw {...rawProps}>
              {children}
              {isFieldRequired(validationSchema, name) && " *"}
            </FormLabelRaw>
          );
        }

        return <FormLabelRaw {...rawProps}>{children}</FormLabelRaw>;
      }}
    </FormikConsumer>
  );
};

export { FormLabel, FormLabelRaw };
