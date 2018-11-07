import * as React from "react";
import { FormGroup } from "reactstrap";

import { FormInput, FormInputProps } from "./FormInput";
import { FormLabel } from "./FormLabel";

interface IFieldGroup {
  label?: string | React.ReactNode;
}

type FieldGroupProps = IFieldGroup & FormInputProps;

export const FormField: React.SFC<FieldGroupProps> = ({ label, name, ...inputProps }) => (
  <FormGroup>
    {label && <FormLabel name={name}>{label}</FormLabel>}
    <FormInput name={name} {...inputProps} />
  </FormGroup>
);
