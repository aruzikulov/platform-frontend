import * as cn from "classnames";
import { Field, FieldAttributes, FieldProps, FormikConsumer } from "formik";
import { map, mapValues } from "lodash";
import * as React from "react";
import { FormGroup, Input } from "reactstrap";

import { FormLabel } from "./FormLabel";
import { isFieldRequired, isNonValid, isValid } from "./utils";

import * as styles from "./FormStyles.module.scss";

export const NONE_KEY = "";
export const BOOL_TRUE_KEY = "true";
export const BOOL_FALSE_KEY = "false";

export const boolify = <T extends {}>(values: T): T => {
  if (!values) return values;

  return mapValues(values, key => {
    if (key === BOOL_TRUE_KEY) return true;
    if (key === BOOL_FALSE_KEY) return false;
    return key;
  }) as T;
};

export const unboolify = <T extends {}>(values: T): T => {
  if (!values) return values;

  return mapValues(values, key => {
    if (key === true) return BOOL_TRUE_KEY;
    if (key === false) return BOOL_FALSE_KEY;
    return key;
  }) as T;
};

interface IOwnProps {
  extraMessage?: string | React.ReactNode;
  "data-test-id"?: string;
}
interface IFieldGroup {
  label?: string | React.ReactNode;
  values?: {
    [key: string]: string | React.ReactNode;
  };
  customOptions?: React.ReactNode[];
  disabledValues?: {
    [key: string]: boolean;
  };
}
type FieldGroupProps = IFieldGroup & FieldAttributes<any>;

export class FormSelectField extends React.Component<FieldGroupProps & IOwnProps> {
  renderOptions = () =>
    this.props.customOptions
      ? this.props.customOptions
      : map(this.props.values, (value, key) => (
          <option
            key={key}
            value={key}
            disabled={this.props.disabledValues && this.props.disabledValues[key]}
          >
            {value}
          </option>
        ));

  render(): React.ReactNode {
    const { label, name, extraMessage, "data-test-id": dataTestId, disabled } = this.props;

    return (
      <FormikConsumer>
        {({ touched, errors, setFieldTouched, validationSchema }) => {
          //This is done due to the difference between reactstrap and @typings/reactstrap
          const inputExtraProps = {
            invalid: isNonValid(touched, errors, name),
          } as any;

          return (
            <FormGroup>
              {label && <FormLabel name={name}>{label}</FormLabel>}
              <div className={cn(styles.customSelect, disabled && styles.disabled)}>
                <Field
                  name={name}
                  render={({ field }: FieldProps) => (
                    <Input
                      {...field}
                      disabled={disabled && isFieldRequired(validationSchema, name)}
                      onFocus={() => setFieldTouched(name, true)}
                      type="select"
                      value={field.value}
                      valid={isValid(touched, errors, name)}
                      data-test-id={dataTestId}
                      {...inputExtraProps}
                    >
                      {this.renderOptions()}
                    </Input>
                  )}
                />
              </div>
              {extraMessage ? (
                <div className={styles.noteLabel}>{extraMessage}</div>
              ) : (
                <>
                  {isNonValid(touched, errors, name) && (
                    <div className={styles.errorLabel}>{errors[name]}</div>
                  )}
                </>
              )}
            </FormGroup>
          );
        }}
      </FormikConsumer>
    );
  }
}
