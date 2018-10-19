import * as cn from "classnames";
import { Field, FieldAttributes, FieldProps, FormikConsumer } from "formik";
import * as React from "react";
import { FormGroup, Input } from "reactstrap";

import { CommonHtmlProps, InputType, TTranslatedString } from "../../../../types";
import { Avatar } from "../../Avatar";
import { FormLabel } from "./FormLabel";
import { isNonValid } from "./utils";

import * as styles from "./FormFieldColorful.module.scss";

interface IFieldGroup {
  label?: string | React.ReactNode;
  placeholder?: string | React.ReactNode;
  type?: InputType;
  maxLength?: string;
  showAvatar?: boolean;
  errorMessage?: TTranslatedString;
}
type FieldGroupProps = IFieldGroup & FieldAttributes<any> & CommonHtmlProps;

export class FormFieldColorful extends React.Component<FieldGroupProps> {
  render(): React.ReactNode {
    const { label, type, placeholder, name, className, showAvatar, ...props } = this.props;

    return (
      <FormikConsumer>
        {({ touched, errors }) => {
          //This is done due to the difference between reactstrap and @typings/reactstrap
          const inputExtraProps = { invalid: isNonValid(touched, errors, name) } as any;

          return (
            <FormGroup>
              {label && <FormLabel>{label}</FormLabel>}
              <Field
                name={name}
                render={({ field }: FieldProps) => {
                  const validClass = () => {
                    if (field.value) {
                      return errors[name] !== undefined ? "is-invalid" : "is-valid";
                    }

                    return "";
                  };

                  return (
                    <>
                      <div className={cn(styles.inputWrapper, validClass())}>
                        <Input
                          className={cn(styles.input, className)}
                          {...field}
                          type={type}
                          value={field.value}
                          placeholder={placeholder || label}
                          {...inputExtraProps}
                          {...props}
                        />
                        {showAvatar && (
                          <div className={styles.addon}>
                            <Avatar seed={field.value || ""} />
                          </div>
                        )}
                      </div>
                      {isNonValid(touched, errors, name) && (
                        <div className={styles.errorLabel}>{errors[name]}</div>
                      )}
                    </>
                  );
                }}
              />
            </FormGroup>
          );
        }}
      </FormikConsumer>
    );
  }
}
