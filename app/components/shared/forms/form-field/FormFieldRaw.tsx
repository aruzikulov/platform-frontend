import * as cn from "classnames";
import * as React from "react";
import { FormGroup, Input, InputGroup, InputGroupAddon, InputProps } from "reactstrap";

import { CommonHtmlProps } from "../../../../types";
import { IFormInputExternalProps } from "./FormInput";
import { FormLabelRaw } from "./FormLabel";
import { computedValue, countedCharacters } from "./utils";

import * as styles from "./FormStyles.module.scss";

export interface IFieldGroupRawExternalProps {
  label?: string | React.ReactNode;
  charactersLimit?: number;
  invalid?: boolean;
  renderInput?: (props: FieldGroupRawProps) => React.ReactNode;
}

type FieldGroupRawProps = IFormInputExternalProps &
  IFieldGroupRawExternalProps &
  InputProps &
  CommonHtmlProps;

export class FormFieldRaw extends React.Component<FieldGroupRawProps> {
  render(): React.ReactNode {
    const {
      value,
      name,
      type,
      placeholder,
      label,
      prefix,
      suffix,
      className,
      addonStyle,
      charactersLimit,
      errorMsg,
      onChange,
      renderInput,
      invalid,
      ...props
    } = this.props;

    const val = computedValue(value, charactersLimit);
    const isInvalid = invalid || !!errorMsg;

    const inputProps = {
      className: cn(className, styles.inputField),
      value: val,
      type,
      invalid: isInvalid,
      valid: !isInvalid,
      placeholder,
      onChange,
      ...props,
    };

    const renderInputElement = renderInput
      ? renderInput
      : (props: FieldGroupRawProps) => <Input {...props} />;

    return (
      <FormGroup>
        {label && <FormLabelRaw>{label}</FormLabelRaw>}
        <InputGroup className={cn(invalid && "is-invalid")}>
          {prefix && (
            <InputGroupAddon addonType="prepend" className={cn(styles.addon, addonStyle)}>
              {prefix}
            </InputGroupAddon>
          )}
          {renderInputElement(inputProps)}
          {suffix && (
            <InputGroupAddon addonType="append" className={cn(styles.addon, addonStyle)}>
              {suffix}
            </InputGroupAddon>
          )}
        </InputGroup>
        {errorMsg && <div className={styles.errorLabel}>{errorMsg}</div>}
        {charactersLimit && <div>{countedCharacters(val, charactersLimit)}</div>}
      </FormGroup>
    );
  }
}
