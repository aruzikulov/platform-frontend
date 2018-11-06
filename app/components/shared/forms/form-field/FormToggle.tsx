import * as cn from "classnames";
import { connect, Field, FieldProps } from "formik";
import * as React from "react";

import { TFormikConnect } from "../../../../types";

import * as styles from "./FormToggle.module.scss";

interface IProps {
  disabledLabel: string | React.ReactNode;
  enabledLabel: string | React.ReactNode;
  name: string;
  disabled?: boolean;
  trueValue?: any;
  falseValue?: any;
  "data-test-id"?: string;
}

interface IInternalProps {
  value: boolean;
  onChange: (a: React.ChangeEvent<any>) => any;
}

export const ToggleComponent: React.SFC<IProps & IInternalProps> = ({
  disabledLabel,
  enabledLabel,
  onChange,
  value,
  name,
  disabled,
  "data-test-id": dataTestId,
}) => {
  return (
    <div className={styles.toggle}>
      <div>{disabledLabel}</div>
      <label className={styles.toggleWrapper}>
        <input
          name={name}
          className={styles.input}
          type="checkbox"
          onChange={onChange}
          checked={value}
          disabled={disabled}
          data-test-id={dataTestId}
        />
        <div className={cn(styles.track)}>
          <div className={styles.indicator} />
        </div>
      </label>
      <div>{enabledLabel}</div>
    </div>
  );
};

class FormToggleLayout extends React.Component<IProps & TFormikConnect> {
  static defaultProps = {
    trueValue: true,
    falseValue: false,
  };

  componentWillMount(): void {
    this.setDefaultValueIfNeeded();
  }

  private setDefaultValueIfNeeded(): void {
    const { name, falseValue, formik } = this.props;
    const { values, setFieldValue } = formik;

    const value = values[name];

    if (value === undefined) {
      setFieldValue(this.props.name, falseValue);
    }
  }

  private onChange = (e: React.ChangeEvent<any>) => {
    const { trueValue, falseValue, formik } = this.props;
    const { setFieldValue } = formik;

    const isChecked = e.target.checked;

    const finalValue = isChecked ? trueValue : falseValue;

    setFieldValue(this.props.name, finalValue);
  };

  render(): React.ReactNode {
    const { name, trueValue } = this.props;

    return (
      <Field
        name={name}
        render={({ field }: FieldProps) => (
          <ToggleComponent
            {...this.props}
            {...field}
            value={field.value === trueValue}
            onChange={this.onChange}
          />
        )}
      />
    );
  }
}

export const FormToggle = connect<IProps, any>(FormToggleLayout);
