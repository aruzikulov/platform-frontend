import { Field, FieldAttributes, FieldProps } from "formik";
import * as React from "react";
import { FormGroup, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps, TTranslatedString } from "../../../../types";
import { FormError } from "./FormError";
import { FormLabel } from "./FormLabel";

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

    const computedValue = (value: string | undefined, limit: number | undefined): string => {
      if (!value) {
        return "";
      }

      if (!limit) {
        return value;
      }

      return charactersLimit && value.length > limit ? value.slice(0, charactersLimit - 1) : value;
    };

    const countedCharacters = (value: string | undefined, limit: number | undefined): string => {
      return `${computedValue(value, limit).length}/${limit}`;
    };

    return (
      <FormGroup>
        {label && <FormLabel>{label}</FormLabel>}
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
