import * as cn from "classnames";
import { FastField, FieldAttributes, FieldProps, FormikConsumer } from "formik";
import { get } from "lodash";
import * as React from "react";
import { FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps, InputType } from "../../../../types";
import { convertToPrecision } from "../../../eto/utils";
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
  customOnBlur?: Function;
}

type FieldGroupProps = IFieldGroup & FieldAttributes<{}> & CommonHtmlProps;

export const NumberTransformingField = ({
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
  customOnBlur,
  ...props
}: FieldGroupProps) => (
  <FormikConsumer>
    {({ touched, errors, setFieldValue }) => {
      //This is done due to the difference between reactstrap and @typings/reactstrap
      const inputExtraProps = {
        invalid: isNonValid(touched, errors, name),
      } as any;
      return (
        <FormGroup className={styles.keyValueField}>
          {label && <FormLabel name={name}>{label}</FormLabel>}
          <FastField
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
                  onBlur={e => {
                    if (customOnBlur) {
                      customOnBlur(e);
                    }
                    setFieldValue(name, convertToPrecision(2)(e.target.valueAsNumber));
                  }}
                  onChange={e =>
                    setFieldValue(name, e.target.value === "" ? undefined : e.target.value)
                  }
                  type="number"
                  value={field.value !== undefined ? field.value : ""}
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
