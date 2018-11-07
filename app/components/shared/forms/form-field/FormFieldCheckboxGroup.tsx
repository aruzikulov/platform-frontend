import { connect, Field, FieldProps, FormikConsumer, FormikContext } from "formik";
import { includes } from "lodash";
import * as React from "react";

import { CheckboxComponent } from "./FormCheckbox";

interface IFormFieldCheckboxGroupProps {
  name: string;
}

export class FormFieldCheckboxGroupLayout extends React.Component<
  IFormFieldCheckboxGroupProps & {
    formik: FormikContext<any>;
  }
> {
  componentWillMount(): void {
    this.setDefaultValueIfNeeded();
  }

  private setDefaultValueIfNeeded(): void {
    const { name, formik } = this.props;
    const { setFieldValue } = formik;
    const value = formik.values[name];

    if (value === undefined) {
      setFieldValue(this.props.name, []);
    }
  }

  render(): React.ReactNode {
    const { name, children } = this.props;

    return <FormFieldNameContext.Provider value={name}>{children}</FormFieldNameContext.Provider>;
  }
}

export const FormFieldCheckboxGroup = connect<IFormFieldCheckboxGroupProps, any>(
  FormFieldCheckboxGroupLayout,
);

interface IFormFieldCheckboxProps {
  value: string;
  label: string;
  disabled?: boolean;
}

const toggle = (values: string[], valueToToggle: string): string[] => {
  const alreadyExists = includes(values, valueToToggle);

  if (alreadyExists) {
    return values.filter(v => v !== valueToToggle);
  } else {
    return [...values, valueToToggle];
  }
};

export class FormFieldCheckbox extends React.Component<IFormFieldCheckboxProps> {
  render(): React.ReactNode {
    const { value, label, disabled, ...restProps } = this.props;

    return (
      <FormikConsumer>
        {({ setFieldValue }) => (
          <FormFieldNameContext.Consumer>
            {fieldName => (
              <Field
                name={fieldName}
                render={({ field }: FieldProps) => (
                  <CheckboxComponent
                    {...restProps}
                    name={fieldName}
                    disabled={disabled}
                    label={label}
                    value={value}
                    checked={includes(field.value, value)}
                    onChange={() => setFieldValue(fieldName, toggle(field.value, value))}
                  />
                )}
              />
            )}
          </FormFieldNameContext.Consumer>
        )}
      </FormikConsumer>
    );
  }
}

const FormFieldNameContext = React.createContext("FORM FIELD UNKNOWN");
