import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { compose } from "redux";
import * as Yup from "yup";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { externalRoutes } from "../../externalRoutes";
import { Button } from "../../shared/buttons";
import { FormField } from "../../shared/forms";
import { InfoBlock } from "../../shared/InfoBlock";

const EMAIL = "email";
const PASSWORD = "password";
const REPEAT_PASSWORD = "repeatPassword";

export interface IFormValues {
  email: string;
  password: string;
  repeatPassword: string;
}

export interface IStateProps {
  isLoading?: boolean;
  errorMsg?: string;
}

interface IDispatchProps {
  submitForm: (values: IFormValues) => void;
}

const validationSchema = Yup.object().shape({
  [EMAIL]: Yup.string()
    .required()
    .email(),
  [PASSWORD]: Yup.string()
    .required()
    .min(8),
  [REPEAT_PASSWORD]: Yup.string()
    .required()
    .oneOf([Yup.ref(PASSWORD)], "Passwords are not equal"),
});

const RegisterLightWalletForm = (
  formikBag: FormikProps<IFormValues> & IStateProps & { restore: boolean },
) => (
  <Form>
    {/* TODO: ADD TRANSLATIONS */}
    <FormField
      placeholder="Email Address"
      type="email"
      name={EMAIL}
      data-test-id="wallet-selector-register-email"
    />
    <FormField
      type="password"
      placeholder="Password"
      name={PASSWORD}
      data-test-id="wallet-selector-register-password"
    />
    <FormField
      type="password"
      placeholder="Confirm Password"
      name={REPEAT_PASSWORD}
      data-test-id="wallet-selector-register-confirm-password"
    />
    <div className="text-center">
      <Button
        type="submit"
        disabled={formikBag.isSubmitting || !formikBag.isValid || formikBag.isLoading}
        data-test-id="wallet-selector-register-button"
      >
        {formikBag.restore ? (
          <FormattedMessage id="wallet-selector.neuwallet.restore" />
        ) : (
          <FormattedMessage id="wallet-selector.neuwallet.register" />
        )}
      </Button>
    </div>
  </Form>
);

const RegisterEnhancedLightWalletForm = withFormik<
  IDispatchProps & IStateProps & { restore: boolean },
  IFormValues
>({
  validationSchema: validationSchema,
  mapPropsToValues: () => ({
    email: "",
    password: "",
    repeatPassword: "",
  }),
  handleSubmit: (values, props) => props.props.submitForm(values),
})(RegisterLightWalletForm);

export const RegisterWalletComponent: React.SFC<
  IDispatchProps & IStateProps & { restore: boolean }
> = props => {
  return (
    <>
      <Row>
        <Col xs={12} md={{ size: 8, offset: 2 }}>
          <InfoBlock>
            <FormattedHTMLMessage tagName="span" id="wallet-selector.light.icbm-info.message" />{" "}
            <Link
              to={`${
                externalRoutes.neufundSupport
              }/solutions/articles/36000060442-icbm-investors-registration`}
              target="_blank"
            >
              <FormattedMessage id="wallet-selector.light.icbm-info.read-more-here" />
            </Link>
          </InfoBlock>
        </Col>
      </Row>
      <Row className="justify-content-sm-center mt-3">
        <Col className="align-self-end col-sm-auto col-xs-12">
          <h1
            className="mb-4"
            data-test-id="modals.wallet-selector.register-restore-light-wallet.title"
          >
            {props.restore ? (
              <FormattedMessage id="wallet-selector.neuwallet.restore-prompt" />
            ) : (
              <FormattedMessage id="wallet-selector.neuwallet.register-prompt" />
            )}
          </h1>
          <RegisterEnhancedLightWalletForm {...props} />
        </Col>
      </Row>
    </>
  );
};

export const RegisterLightWallet = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps, { restore: boolean }>({
    stateToProps: state => ({
      errorMsg: state.lightWalletWizard.errorMsg,
      isLoading: state.lightWalletWizard.isLoading,
    }),
    dispatchToProps: dispatch => ({
      submitForm: (values: IFormValues) =>
        dispatch(actions.walletSelector.lightWalletRegister(values.email, values.password)),
    }),
  }),
)(RegisterWalletComponent);
