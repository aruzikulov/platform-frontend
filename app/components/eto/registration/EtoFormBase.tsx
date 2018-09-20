import { connect, Form, FormikProps, FormikValues } from "formik";
import { throttle } from "lodash";
import * as PropTypes from "prop-types";
import * as React from "react";
import * as Yup from "yup";

import {
  getFormFractionDoneCalculator,
  IProgressOptions,
  ProgressCalculator,
} from "../../../modules/eto-flow/selectors";
import { PercentageIndicatorBar } from "../../shared/PercentageIndicatorBar";
import { Section } from "./Shared";

import * as styles from "./EtoFormBase.module.scss";

interface IProps {
  title: string | React.ReactNode;
}

interface IFormPercentageDoneProps {
  validator: Yup.Schema;
  progressOptions?: IProgressOptions;
  values: FormikValues<any>;
}

class PercentageFormDone extends React.Component<IFormPercentageDoneProps> {
  calculate: ProgressCalculator;

  constructor(props: IFormPercentageDoneProps) {
    super(props);

    this.calculate = throttle(
      getFormFractionDoneCalculator(props.validator, props.progressOptions),
      300,
    );
  }

  render(): React.ReactNode {
    const { values } = this.props;
    const calculatedFraction = this.calculate(values);
    return <PercentageIndicatorBar className={styles.progressBar} fraction={calculatedFraction} />;
  }
}

export const EtoFormBaseComponent: React.SFC<
  IProps & IFormPercentageDoneProps & FormikProps<any>
> = ({ children, title, validator, progressOptions, values }) => (
  <div>
    <Form className={styles.form}>
      <h4 className={styles.header}>{title}</h4>

      <Section>
        <PercentageFormDone
          validator={validator}
          progressOptions={progressOptions}
          values={values}
        />
      </Section>

      {children}
    </Form>
  </div>
);

export const EtoFormBase = connect(EtoFormBaseComponent);
