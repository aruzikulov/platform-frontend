import { connect, Field, FieldProps } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { findMax, findMin } from "../../../../lib/api/eto/EtoApiUtils";
import { TFormikConnect } from "../../../../types";

import * as styles from "./FormRange.module.scss";

type TStep = "any" | number;
type TUnit = string | React.ReactNode | undefined;

interface IProps {
  min?: number;
  max?: number;
  name: string;
  unit?: TUnit;
  unitMin?: TUnit;
  unitMax?: TUnit;
  step?: TStep;
  disabled?: boolean;
}

interface IInternalProps {
  min: number;
  max: number;
  value: number;
  onChange: (e: React.ChangeEvent<any>) => any;
}

interface IRangeLabelProps {
  label: string | React.ReactNode;
  value: number;
  unit: TUnit;
}

const RangeLabel: React.SFC<IRangeLabelProps> = ({ label, value, unit }) => (
  <div className={styles.label}>
    <div>{label}</div>
    <div className={styles.labelDetails}>
      {value} {unit}
    </div>
  </div>
);

export const RangeComponent: React.SFC<IProps & IInternalProps> = ({
  disabled,
  name,
  unit,
  unitMin,
  unitMax,
  min,
  max,
  step,
  onChange,
  value,
}) => (
  <div className={styles.range}>
    <RangeLabel
      label={<FormattedMessage id="shared-component.range.min" />}
      value={min}
      unit={unitMin || unit}
    />
    <input
      disabled={disabled}
      name={name}
      value={value}
      min={min}
      max={max}
      step={step || 1}
      className={styles.input}
      type="range"
      onChange={onChange}
    />
    <RangeLabel
      label={<FormattedMessage id="shared-component.range.max" />}
      value={max}
      unit={unitMax || unit}
    />
    <div className={styles.currentValue}>
      {value} {unitMin && unitMax ? (value > 1 ? unitMax : unitMin) : unit}
    </div>
  </div>
);

const FormRangeBase: React.SFC<IProps & TFormikConnect> = ({
  name,
  formik: { validationSchema },
  ...props
}) => {
  const schema = validationSchema && validationSchema().fields[name];
  const min = props.min !== undefined ? props.min : findMin(schema);
  const max = props.max !== undefined ? props.max : findMax(schema);

  return (
    // TODO: add here form label + form validation if needed
    <Field
      name={name}
      render={({ field }: FieldProps) => {
        return <RangeComponent {...props} min={min} max={max} {...field} />;
      }}
    />
  );
};

export const FormRange = connect<IProps, any>(FormRangeBase);
