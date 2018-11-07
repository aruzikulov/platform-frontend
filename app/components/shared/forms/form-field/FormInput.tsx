import * as cn from "classnames";
import { Field, FieldAttributes, FieldProps, FormikConsumer } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps, InputType } from "../../../../types";
import { FormError } from "./FormError";
import { computedValue, countedCharacters, isNonValid, isValid } from "./utils";

import * as styles from "./FormStyles.module.scss";

export enum InputSize {
  NORMAL = "",
  SMALL = "sm",
}

export interface IFormInputExternalProps {
  min?: string;
  max?: string;
  placeholder?: string | React.ReactNode;
  errorMsg?: string | React.ReactNode;
  type?: InputType;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  addonStyle?: string;
  maxLength?: number;
  charactersLimit?: number;
  size?: InputSize;
  customValidation?: (value: any) => string | Function | Promise<void> | undefined;
  ignoreTouched?: boolean;
}

export type FormInputProps = IFormInputExternalProps & FieldAttributes<any> & CommonHtmlProps;

const transform = (value: string, charactersLimit?: number) => {
  return value === undefined ? "" : computedValue(value, charactersLimit);
};

const transformBack = (value: number | string) => {
  if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    return value.trim().length > 0 ? value : undefined;
  } else {
    return undefined;
  }
};

/**
 * Formik connected form input without FormGroup and FormLabel.
 */
export class FormInput extends React.Component<FormInputProps> {
  static defaultProps = {
    size: InputSize.NORMAL,
  };

  render(): React.ReactNode {
    const {
      type,
      placeholder,
      name,
      prefix,
      suffix,
      className,
      addonStyle,
      charactersLimit,
      errorMsg,
      min,
      max,
      size,
      disabled,
      customValidation,
      ignoreTouched,
      maxLength,
      ...props
    } = this.props;
    return (
      <FormikConsumer>
        {({ touched, errors, setFieldTouched, setFieldValue }) => {
          //This is done due to the difference between reactstrap and @typings/reactstrap
          const inputExtraProps = {
            invalid: isNonValid(touched, errors, name, ignoreTouched),
          } as any;
          return (
            <Field
              name={name}
              validate={customValidation}
              render={({ field }: FieldProps) => {
                const val = transform(field.value, charactersLimit);
                return (
                  <>
                    <InputGroup size={size}>
                      {prefix && (
                        <InputGroupAddon
                          addonType="prepend"
                          className={cn(
                            styles.addon,
                            addonStyle,
                            isValid(touched, errors, name) && "is-invalid",
                          )}
                        >
                          {prefix}
                        </InputGroupAddon>
                      )}
                      <Input
                        maxLength={maxLength}
                        className={cn(
                          className,
                          styles.inputField,
                          isValid(touched, errors, name) && "is-invalid",
                        )}
                        {...field}
                        onChange={e => {
                          setFieldTouched(name);
                          setFieldValue(
                            name,
                            transformBack(
                              type === "number" ? e.target.valueAsNumber : e.target.value,
                            ),
                          );
                        }}
                        type={type}
                        value={val}
                        valid={isValid(touched, errors, name)}
                        placeholder={placeholder}
                        disabled={disabled}
                        {...inputExtraProps}
                        {...props}
                      />
                      {suffix && (
                        <InputGroupAddon
                          addonType="append"
                          className={cn(
                            styles.addon,
                            isValid(touched, errors, name) && "is-invalid",
                          )}
                        >
                          {suffix}
                        </InputGroupAddon>
                      )}
                    </InputGroup>
                    <FormError
                      name={name}
                      defaultMessage={errorMsg}
                      ignoreTouched={ignoreTouched}
                    />
                    {charactersLimit && <div>{countedCharacters(val, charactersLimit)}</div>}

                    {min &&
                      parseInt(field.value, 10) < parseInt(min, 10) && (
                        <div className={styles.errorLabel}>
                          <FormattedMessage id="form.field.error.number.min" values={{ min }} />
                        </div>
                      )}

                    {max &&
                      parseInt(field.value, 10) > parseInt(max, 10) && (
                        <div className={styles.errorLabel}>
                          <FormattedMessage id="form.field.error.number.max" values={{ max }} />
                        </div>
                      )}
                  </>
                );
              }}
            />
          );
        }}
      </FormikConsumer>
    );
  }
}
