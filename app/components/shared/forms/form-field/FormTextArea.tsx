import { Field, FieldAttributes, FieldProps } from "formik";
import * as React from "react";
import { FormGroup, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps, TTranslatedString } from "../../../../types";
import { FormError } from "./FormError";
import { FormLabel } from "./FormLabel";
import { computedValue, countedCharacters } from "./utils";

interface IFieldGroup {
  disabled?: boolean;
  label?: TTranslatedString;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  charactersLimit?: number;
}
type FieldGroupProps = IFieldGroup & FieldAttributes<any> & CommonHtmlProps;
export class FormTextArea extends React.Component<FieldGroupProps> {
  render(): React.ReactNode {
    const {
      label,
      disabled,
      placeholder,
      name,
      prefix,
      suffix,
      className,
      charactersLimit,
    } = this.props;

    return (
      <FormGroup>
        {label && <FormLabel name={name}>{label}</FormLabel>}
        <Field
          name={name}
          render={({ field }: FieldProps) => {
            const { value } = field;

            return (
              <>
                <InputGroup>
                  {prefix && (
                    <InputGroupAddon addonType="prepend" className={className}>
                      {prefix}
                    </InputGroupAddon>
                  )}
                  <textarea
                    {...field}
                    disabled={disabled}
                    value={computedValue(value, charactersLimit)}
                    placeholder={placeholder}
                    className={className}
                  />
                  {suffix && <InputGroupAddon addonType="append">{suffix}</InputGroupAddon>}
                </InputGroup>
                <FormError name={name} />
                {charactersLimit && countedCharacters(value, charactersLimit)}
              </>
            );
          }}
        />
      </FormGroup>
    );
  }
}
