import * as cn from "classnames";
import { Field, FieldAttributes, FieldProps, FormikConsumer } from "formik";
import { get } from "lodash";
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
  ratio?: number;
  customValidation?: (value: any) => string | Function | Promise<void> | undefined;
}

type FieldGroupProps = IFieldGroup & FieldAttributes<{}> & CommonHtmlProps;

const transform = (value: number, ratio?: number) => {
  if (value && !Number.isNaN(value)) {
    // if user types in more than 100 percent (=> internal value is larger than 1),
    // value*ratio returns a weird number due to JS number rounding behavior
    // example: 1.11 * 100 === 111.00000000000001
    // here we manually check for this condition and round down the result
    const result = ratio !== undefined ? value * ratio : value;
    return value > 1 ? Math.floor(result) : result;
  } else {
    return "";
  }
};
const transformBack = (value: number, ratio?: number) => {
  const result = ratio !== undefined ? value / ratio : value;
  return value && !Number.isNaN(value) ? result : undefined;
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
      disabled,
      customValidation,
      ...props
    } = this.props;

    return (
      <FormikConsumer>
        {({ touched, errors, setFieldValue, setFieldTouched }) => {
          //This is done due to the difference between reactstrap and @typings/reactstrap
          const inputExtraProps = {
            invalid: isNonValid(touched, errors, name),
          } as any;

          return (
            <FormGroup>
              {label && <FormLabel name={name}>{label}</FormLabel>}
              <Field
                name={name}
                validate={customValidation}
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
                        setFieldTouched(name);
                        setFieldValue(name, transformBack(e.target.valueAsNumber, ratio));
                      }}
                      type="number"
                      valid={isValid(touched, errors, name)}
                      placeholder={placeholder || label}
                      disabled={disabled}
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
                <div className={styles.errorLabel}>{get(errors, name)}</div>
              )}
            </FormGroup>
          );
        }}
      </FormikConsumer>
    );
  }
}
