import { Form, FormikConsumer } from "formik";
import { throttle } from "lodash";
import * as React from "react";
import * as Yup from "yup";

import {
  getFormFractionDoneCalculator,
  IProgressOptions,
  ProgressCalculator,
} from "../../../modules/eto-flow/utils";
import { PercentageIndicatorBar } from "../../shared/PercentageIndicatorBar";
import { Section } from "./Shared";

import * as styles from "./EtoFormBase.module.scss";

interface IProps {
  title: string | React.ReactNode;
  "data-test-id"?: string;
}

interface IFormPercentageDoneProps {
  validator: Yup.Schema<any>;
  progressOptions?: IProgressOptions;
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
    return (
      <FormikConsumer>
        {({ values }) => {
          const calculatedFraction = this.calculate(values);
          return (
            <PercentageIndicatorBar
              className={styles.progressBar}
              percent={calculatedFraction * 100}
            />
          );
        }}
      </FormikConsumer>
    );
  }
}

export const EtoFormBase: React.SFC<IProps & IFormPercentageDoneProps> = ({
  children,
  title,
  validator,
  progressOptions,
  "data-test-id": dataTestId,
}) => (
  <div data-test-id={dataTestId}>
    <Form className={styles.form}>
      <h4 className={styles.header}>{title}</h4>

      <Section>
        <PercentageFormDone validator={validator} progressOptions={progressOptions} />
      </Section>

      {children}
    </Form>
  </div>
);
