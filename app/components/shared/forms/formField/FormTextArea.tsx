import { connect, Field, FieldAttributes, FieldProps, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormGroup, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps, TTranslatedString } from "../../../../types";
import { FormLabel } from "./FormLabel";
import { isNonValid } from "./utils";

interface IFieldGroup {
  disabled?: boolean;
  label?: TTranslatedString;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  charactersLimit?: number;
}
type FieldGroupProps = IFieldGroup & FieldAttributes & CommonHtmlProps & FormikProps<any>;
class FormTextAreaComponent extends React.Component<FieldGroupProps> {
  render(): React.ReactChild {
    const {
      label,
      disabled,
      placeholder,
      name,
      prefix,
      suffix,
      className,
      charactersLimit,
      formik,
    } = this.props;
    const { touched, errors } = formik;

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
                <div className="mt-2">
                  {isNonValid(touched, errors, name) && <div>{errors[name]}</div>}
                  {charactersLimit && <div>{countedCharacters(value, charactersLimit)}</div>}
                </div>
              </>
            );
          }}
        />
      </FormGroup>
    );
  }
}

export const FormTextArea = connect(FormTextAreaComponent);
