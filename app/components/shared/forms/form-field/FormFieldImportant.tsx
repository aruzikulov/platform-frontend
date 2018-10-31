import * as cn from "classnames";
import { Field, FieldAttributes, FieldProps, FormikConsumer, getIn } from "formik";
import * as React from "react";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps, TTranslatedString } from "../../../../types";
import { CustomTooltip } from "../../CustomTooltip";
import { FormLabel } from "./FormLabel";
import { isNonValid } from "./utils";

import * as icon from "../../../../assets/img/notifications/warning.svg";
import * as styles from "./FormFieldImportant.module.scss";
import * as formStyles from "./FormStyles.module.scss";

type InputType =
  | "text"
  | "email"
  | "date"
  | "datetime-local"
  | "month"
  | "number"
  | "search"
  | "tel"
  | "url"
  | "password"
  | "datetime"
  | "time";

interface IFieldGroup {
  label?: TTranslatedString;
  placeholder?: string;
  errorMessage?: string | React.ReactNode;
  type?: InputType;
  ignoreTouched?: boolean;
}
type FieldGroupProps = IFieldGroup & FieldAttributes<any> & CommonHtmlProps;

export class FormFieldImportant extends React.Component<FieldGroupProps> {
  render(): React.ReactNode {
    const {
      type,
      placeholder,
      name,
      className,
      errorMessage,
      validate,
      label,
      ignoreTouched,
      ...props
    } = this.props;

    const tooltipId = `${name}_error_notification`;

    return (
      <FormikConsumer>
        {({ touched, errors }) => (
          <>
            {label && <FormLabel name={name}>{label}</FormLabel>}
            <Field
              name={name}
              validate={validate}
              render={({ field }: FieldProps) => (
                <>
                  <InputGroup className={styles.inputGroup}>
                    <Input
                      className={cn(className, formStyles.inputField, styles.input)}
                      {...field}
                      type={type}
                      value={field.value || ""}
                      placeholder={placeholder || ""}
                      {...props as any}
                    />
                    <InputGroupAddon addonType="append" className={formStyles.addon}>
                      {(isNonValid(touched, errors, name, ignoreTouched) || errorMessage) && (
                        <>
                          <img id={tooltipId} src={icon} />
                          <CustomTooltip target={tooltipId}>
                            {getIn(errors, name) || errorMessage}
                          </CustomTooltip>
                        </>
                      )}
                    </InputGroupAddon>
                  </InputGroup>
                </>
              )}
            />
          </>
        )}
      </FormikConsumer>
    );
  }
}
