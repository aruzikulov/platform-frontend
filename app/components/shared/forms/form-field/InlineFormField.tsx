import { Field, FieldAttributes, FieldProps, FormikConsumer } from "formik";
import * as React from "react";
import { Col, FormGroup, Input, InputGroup, InputGroupAddon, Label, Row } from "reactstrap";

import { InputType } from "../../../../types";
import { isNonValid, isValid } from "./utils";

import * as styles from "./FormStyles.module.scss";

interface IFieldGroup {
  label?: string;
  placeholder?: string;
  type?: InputType;
  prefix?: string;
  suffix?: string;
}
type FieldGroupProps = IFieldGroup & FieldAttributes<any>;

export class InlineFormField extends React.Component<FieldGroupProps> {
  render(): React.ReactNode {
    const { label, type, placeholder, name, prefix, suffix } = this.props;

    return (
      <FormikConsumer>
        {({ touched, errors }) => {
          const valid = isValid(touched, errors, name);

          return (
            <FormGroup>
              <Row className="align-items-center">
                {label && (
                  <Col className="col-auto">
                    <Label for={name} className="m-0">
                      {label}
                    </Label>
                  </Col>
                )}
                <Col className="col-auto">
                  <Field
                    name={name}
                    render={({ field }: FieldProps) => (
                      <InputGroup>
                        {prefix && <InputGroupAddon addonType="prepend">{prefix}</InputGroupAddon>}
                        <Input
                          {...field}
                          type={type}
                          value={field.value || ""}
                          placeholder={placeholder || label}
                          valid={valid}
                        />
                        {suffix && <InputGroupAddon addonType="append">{suffix}</InputGroupAddon>}
                      </InputGroup>
                    )}
                  />
                  <div className={styles.errorLabel}>
                    {isNonValid(touched, errors, name) && <div>{errors[name]}</div>}
                  </div>
                </Col>
              </Row>
            </FormGroup>
          );
        }}
      </FormikConsumer>
    );
  }
}
