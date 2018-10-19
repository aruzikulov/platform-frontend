import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { Button } from "../../shared/buttons";
import { FormField } from "../../shared/forms";
import { Panel } from "../../shared/Panel";

interface IDispatchProps {
  submitForm: (values: IFormValues) => void;
  currentValues?: IFormValues;
}

interface IFormValues {
  email: string;
}

const ChangeEmailForm = injectIntlHelpers<FormikProps<IFormValues>>(
  ({ intl: { formatIntlMessage }, ...props }) => (
    <Form>
      <FormField
        type="email"
        placeholder={formatIntlMessage("form.placeholder.enter-new-email")}
        name={"email"}
      />
      <div className="text-center">
        <Button type="submit" disabled={!props.values.email}>
          <FormattedMessage id="form.button.submit" />
        </Button>
      </div>
    </Form>
  ),
);

const SettingsEnhancedChangeEmailForm = withFormik<IDispatchProps, IFormValues>({
  mapPropsToValues: props => props.currentValues as IFormValues,
  handleSubmit: (values, props) => {
    props.props.submitForm(values);
    values.email = "";
  },
})(ChangeEmailForm);

export const ChangeEmailComponent: React.SFC<IDispatchProps & IIntlProps> = ({
  intl: { formatIntlMessage },
  ...props
}) => {
  return (
    <Panel headerText={formatIntlMessage("settings.change-email-component.header")}>
      <Row>
        {/* TODO:  Change according to Marketing requests*/}
        <Col xs={6} className="mt-3">
          <p data-test-id="paragraph-section">
            <FormattedMessage id="settings.change-email-component.text" />
          </p>
        </Col>
        <Col className="mt-3 mb-4" data-test-id="form-section">
          <SettingsEnhancedChangeEmailForm {...props} />
        </Col>
      </Row>
    </Panel>
  );
};

export const ChangeEmail = compose<React.SFC>(
  appConnect<IDispatchProps>({
    dispatchToProps: dispatch => ({
      submitForm: (values: IFormValues) => {
        dispatch(actions.settings.addNewEmail(values.email));
      },
    }),
  }),
  injectIntlHelpers,
)(ChangeEmailComponent);
