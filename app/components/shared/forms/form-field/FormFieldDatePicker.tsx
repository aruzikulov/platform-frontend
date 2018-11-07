import { Field, FieldProps } from "formik";
import * as React from "react";
import * as DateTime from "react-datetime";

import { InlineIcon } from "../../InlineIcon";

import * as iconCalendar from "../../../../assets/img/inline_icons/calendar.svg";
import * as styles from "./FormFieldDatePicker.module.scss";

interface IProps {
  name: string;
}

// We need to do this because of missing type for `renderInput`
// https://github.com/YouCanBookMe/react-datetime/pull/541
type DatetimeProps = DateTime.DatetimepickerProps & {
  renderInput?: (
    props: any,
    openCalendar: () => void,
    closeCalendar: () => void,
    onChange: () => void,
  ) => void;
};

const TypedDatetime = DateTime as React.ComponentType<DatetimeProps>;

const FormFieldDatePicker: React.SFC<IProps> = () => (
  <div className={styles.formFieldDatePicker}>
    <TypedDatetime
      closeOnSelect={true}
      utc={true}
      renderInput={props => {
        return (
          <div className={styles.inputWrapper}>
            <Field
              {...props}
              name={props.name}
              render={({ field }: FieldProps) => {
                return (
                  <input
                    autoComplete="off"
                    value={field.value || props.value}
                    type="text"
                    className="form-control"
                    {...props}
                  />
                );
              }}
            />
            <div className={styles.icon}>
              <InlineIcon svgIcon={iconCalendar} />
            </div>
          </div>
        );
      }}
    />
  </div>
);

export { FormFieldDatePicker, TypedDatetime, DatetimeProps };
