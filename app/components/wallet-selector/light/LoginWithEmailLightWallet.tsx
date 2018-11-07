import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";
import * as Yup from "yup";

import { appConnect } from "../../../store";
import { Button } from "../../shared/buttons";
import { FormField } from "../../shared/forms";

import { FormattedMessage } from "react-intl-phraseapp";
import { actions } from "../../../modules/actions";
import { FormConstantField } from "../../shared/forms/form-field/FormConstantField";
import { WarningAlert } from "../../shared/WarningAlert";

const PASSWORD = "password";

export const PasswordValidator = Yup.object().shape({
  password: Yup.string().required(),
});

export interface IFormValues {
  password: string;
}

interface IDispatchProps {
  submitForm: (values: IFormValues) => void;
}

interface IStateProps {
  isLoading: boolean;
  errorMsg?: string;
}

interface IOwnProps {
  email: string;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

const LoginLightWalletForm: React.SFC<TProps & FormikProps<IFormValues>> = props => (
  <Form>
    <FormField
      type="password"
      placeholder="Password"
      name={PASSWORD}
      data-test-id="light-wallet-login-with-email-password-field"
    />
    <div className="text-center">
      <Button
        type="submit"
        disabled={!props.values.password || props.isLoading}
        data-test-id="wallet-selector-nuewallet.login-button"
      >
        Login
      </Button>
    </div>
  </Form>
);

const LoginEnhancedLightWalletForm = withFormik<TProps, IFormValues>({
  handleSubmit: (values, props) => props.props.submitForm(values),
  validationSchema: PasswordValidator,
})(LoginLightWalletForm);

export const LoginWithEmailLightWalletComponent: React.SFC<
  IDispatchProps & IStateProps & IOwnProps
> = props => {
  return (
    <>
      <Row>
        <p className="small mx-auto">
          <FormattedMessage id="wallet-selector.neuwallet.login.prompt" />
        </p>
      </Row>
      <Row>
        <Col xs={12}>
          <FormConstantField
            value={props.email}
            className="mb-2"
            data-test-id="light-wallet-login-with-email-email-field"
          />
          <LoginEnhancedLightWalletForm {...props} />
          {props.errorMsg && <WarningAlert>{props.errorMsg}</WarningAlert>}
        </Col>
      </Row>
    </>
  );
};

export const LoginWithEmailLightWallet = compose<React.SFC<IOwnProps>>(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: state => ({
      errorMsg: state.lightWalletWizard.errorMsg,
      isLoading: state.lightWalletWizard.isLoading,
    }),
    dispatchToProps: (dispatch, ownProps) => ({
      submitForm: (values: IFormValues) => {
        dispatch(actions.walletSelector.lightWalletLogin(ownProps.email, values.password));
      },
    }),
  }),
)(LoginWithEmailLightWalletComponent);
