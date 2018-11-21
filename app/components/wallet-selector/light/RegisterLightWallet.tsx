import * as cn from "classnames";
import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";
import * as Yup from "yup";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { Button } from "../../shared/buttons";
import { FormField } from "../../shared/forms";

import * as styles from "./WalletLight.module.scss";

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
class RegisterLightWalletForm extends React.Component<
  FormikProps<IFormValues> & IStateProps & IIntlProps & { restore: boolean }
> {
  componentDidUpdate = (
    nextProps: FormikProps<IFormValues> & IStateProps & { restore: boolean },
  ) => {
    if (
      this.props.isLoading === true &&
      this.props.isSubmitting === true &&
      nextProps.isLoading === false &&
      nextProps.isSubmitting === true
    ) {
      this.props.setSubmitting(false);
    }
  };

  render = () => (
    <Form>
      <FormField
        placeholder={`${this.props.intl.formatIntlMessage("wallet-selector.register.email")}`}
        type="email"
        name={EMAIL}
        data-test-id="wallet-selector-register-email"
      />
      <FormField
        type="password"
        placeholder={`${this.props.intl.formatIntlMessage("wallet-selector.register.password")}`}
        name={PASSWORD}
        data-test-id="wallet-selector-register-password"
      />
      <FormField
        type="password"
        placeholder={`${this.props.intl.formatIntlMessage(
          "wallet-selector.register.confirm-password",
        )}`}
        name={REPEAT_PASSWORD}
        data-test-id="wallet-selector-register-confirm-password"
      />
      <div className="text-center">
        <Button
          type="submit"
          disabled={this.props.isSubmitting || !this.props.isValid || this.props.isLoading}
          data-test-id="wallet-selector-register-button"
        >
          {this.props.restore ? (
            <FormattedMessage id="wallet-selector.neuwallet.restore" />
          ) : (
            <FormattedMessage id="wallet-selector.neuwallet.register" />
          )}
        </Button>
      </div>
    </Form>
  );
}

const RegisterEnhancedLightWalletForm: React.SFC = compose<any>(
  injectIntlHelpers,
  withFormik<IDispatchProps & IStateProps & { restore: boolean }, IFormValues>({
    validationSchema: validationSchema,
    mapPropsToValues: () => ({
      email: "",
      password: "",
      repeatPassword: "",
    }),
    handleSubmit: (values, props) => {
      return props.props.submitForm(values);
    },
  }),
)(RegisterLightWalletForm);

export const RegisterWalletComponent: React.SFC<
  IDispatchProps & IStateProps & { restore: boolean }
> = props => {
  return (
    <>
      <Row className={cn(styles.wrapper, "justify-content-sm-center mt-3")}>
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
          <div className={styles.explanation}>
            <FormattedMessage tagName="p" id="wallet-selector.neuwallet.explanation-1" />
          </div>

          <RegisterEnhancedLightWalletForm {...props} />

          <div className={styles.explanation}>
            <FormattedHTMLMessage tagName="span" id="wallet-selector.neuwallet.explanation-2" />
          </div>
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
