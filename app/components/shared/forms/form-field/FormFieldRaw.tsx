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
  controlCursor?: boolean;
}

type FieldGroupRawProps = IFormInputExternalProps &
  IFieldGroupRawExternalProps &
  InputProps &
  CommonHtmlProps;

export class FormFieldRaw extends React.Component<FieldGroupRawProps> {
  private rawStr = "";
  private caretPosition = 0;
  private inputRef?: HTMLInputElement;

  private handleChange = (ev: React.ChangeEvent<any>) => {
    this.rawStr = String(ev.target.value);
    this.caretPosition = Number(ev.target.selectionEnd);

    if (this.props.onChange) {
      this.props.onChange(ev);
    }
  };

  componentDidUpdate({ value }: FieldGroupRawProps): void {
    if (this.props.controlCursor && this.inputRef) {
      const input = this.inputRef;
      if (this.props.value !== value) {
        const str = this.rawStr.substr(0, this.caretPosition);
        const index = String(this.props.value).indexOf(str) + this.caretPosition;

        if (index !== -1) {
          input.setSelectionRange(index, index);
        }
      } else {
        const index = this.caretPosition;
        input.setSelectionRange(index, index);
      }
    }
  }

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
      controlCursor,
      ...props
    } = this.props;

    const val = computedValue(value, charactersLimit);
    const invalid = props.invalid || !!errorMsg;

    return (
      <FormGroup>
        {label && <FormLabelRaw>{label}</FormLabelRaw>}
        <InputGroup className={cn(invalid && "is-invalid")}>
          {prefix && (
            <InputGroupAddon addonType="prepend" className={cn(styles.addon, addonStyle)}>
              {prefix}
            </InputGroupAddon>
          )}
          <Input
            className={cn(className, styles.inputField)}
            type={type}
            value={val}
            valid={!invalid}
            placeholder={placeholder}
            invalid={invalid}
            onChange={this.handleChange}
            innerRef={ref => (this.inputRef = ref)}
            {...props}
          />
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
