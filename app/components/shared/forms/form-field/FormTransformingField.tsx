import * as cn from "classnames";
import { Field, FieldAttributes, FieldProps, FormikConsumer } from "formik";
import * as React from "react";
import { FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps, InputType } from "../../../../types";
import { FormLabel } from "./FormLabel";
import { isNonValid, isValid } from "./utils";

import * as styles from "./FormStyles.module.scss";

interface IFieldGroup {
  label?: string | React.ReactNode;
  placeholder?: string | React.ReactNode;
  type?: InputType;
  prefix?: string;
  suffix?: string;
  addonStyle?: string;
  maxLength?: string;
  ratio: number;
}
type FieldGroupProps = IFieldGroup & FieldAttributes<any> & CommonHtmlProps;

const transform = (value: number, ratio: number) => {
  return value && !isNaN(value) && value * ratio;
};
const transformBack = (value: number, ratio: number) => {
  return value && !isNaN(value) && value / ratio;
};

export class FormTransformingField extends React.Component<FieldGroupProps> {
  render(): React.ReactNode {
    const {
      label,
      type,
      placeholder,
      name,
      prefix,
      suffix,
      className,
      addonStyle,
      ratio,
      ...props
    } = this.props;

    return (
      <FormikConsumer>
        {({ touched, errors, setFieldValue }) => {
          //This is done due to the difference between reactstrap and @typings/reactstrap
          const inputExtraProps = {
            invalid: isNonValid(touched, errors, name),
          } as any;

          return (
            <FormGroup>
              {label && <FormLabel name={name}>{label}</FormLabel>}
              <Field
                name={name}
                render={({ field }: FieldProps) => (
                  <InputGroup>
                    {prefix && (
                      <InputGroupAddon addonType="prepend" className={cn(styles.addon, addonStyle)}>
                        {prefix}
                      </InputGroupAddon>
                    )}
                    <Input
                      className={cn(className, styles.inputField)}
                      {...field}
                      value={transform(field.value, ratio) || ""}
                      onChange={e => {
                        setFieldValue(name, transformBack(e.target.valueAsNumber, ratio));
                      }}
                      type="number"
                      valid={isValid(touched, errors, name)}
                      placeholder={placeholder || label}
                      {...inputExtraProps}
                      {...props}
                    />
                    {suffix && (
                      <InputGroupAddon addonType="append" className={styles.addon}>
                        {suffix}
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                )}
              />
              {isNonValid(touched, errors, name) && (
                <div className={styles.errorLabel}>{errors[name]}</div>
              )}
            </FormGroup>
          );
        }}
      </FormikConsumer>
    );
  }
}
