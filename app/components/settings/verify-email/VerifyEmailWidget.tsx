import * as cn from "classnames";
import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";
import { compose } from "redux";
import * as Yup from "yup";

import { actions } from "../../../modules/actions";
import {
  selectIsThereUnverifiedEmail,
  selectIsUserEmailVerified,
  selectUnverifiedUserEmail,
  selectVerifiedUserEmail,
} from "../../../modules/auth/selectors";
import { selectIsConnectedButtonLocked } from "../../../modules/verify-email-widget/reducer";
import { appConnect } from "../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { Button, EButtonLayout } from "../../shared/buttons";
import { FormField } from "../../shared/forms";
import { Panel } from "../../shared/Panel";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as successIcon from "../../../assets/img/notifications/Success_small.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import { selectIsCancelEmail } from "../../../modules/settings/reducer";
import * as styles from "./VerifyEmailWidget.module.scss";

interface IStateProps {
  isUserEmailVerified: boolean;
  isThereUnverifiedEmail: boolean;
  verifiedEmail?: string;
  unverifiedEmail?: string;
  isLocked?: boolean;
  isEmailTemporaryCancelled: boolean;
}

interface IOwnProps {
  step: number;
}
interface IEnhancedFormProps {
  handleSubmit: (values: IFormValues) => void;
  isLocked?: boolean;
  revertCancelEmail: () => void;
  isThereUnverifiedEmail?: boolean;
}

interface IDispatchProps {
  resendEmail: () => void;
  addNewEmail: (values: { email: string }) => void;
  cancelEmail: () => void;
  revertCancelEmail: () => void;
}

interface IFormValues {
  email: string;
}

interface INoEMailUser {
  addNewEmail: (values: { email: string }) => void;
  isLocked?: boolean;
  isThereUnverifiedEmail?: boolean;
  revertCancelEmail: () => void;
}

/**
 * Workaround for: https://github.com/jaredpalmer/formik/issues/621
 */
function isValid(props: FormikProps<IFormValues>): boolean {
  const noErrors = Object.keys(props.errors).length === 0;
  const notEmpty = !!props.values.email;

  return noErrors && notEmpty;
}

const SetEmailForm = injectIntlHelpers<IEnhancedFormProps & FormikProps<IFormValues>>(
  ({ intl: { formatIntlMessage }, ...props }) => (
    <Form className={cn("mt-2 pt-0 mb-0")}>
      <FormField
        placeholder={formatIntlMessage("settings.verify-email-widget.email-placeholder")}
        name="email"
        data-test-id="verify-email-widget-form-email-input"
      />
      <div className={cn("d-flex justify-content-end text-center flex-wrap", styles.buttons)}>
        {props.isThereUnverifiedEmail && (
          <Button
            data-test-id="verify-email-widget-form-cancel"
            layout={EButtonLayout.SECONDARY}
            onClick={props.revertCancelEmail}
          >
            <FormattedMessage id="form.button.cancel" />
          </Button>
        )}
        <Button
          type="submit"
          layout={EButtonLayout.SECONDARY}
          disabled={!isValid(props) || props.isLocked}
          data-test-id="verify-email-widget-form-submit"
        >
          <FormattedMessage id="form.button.submit" />
        </Button>
      </div>
    </Form>
  ),
);

const EmailFormSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
});

const SetEmailEnhancedForm = withFormik<IEnhancedFormProps, IFormValues>({
  validationSchema: EmailFormSchema,
  handleSubmit: (values, props) => props.props.handleSubmit(values),
})(SetEmailForm);

const NoEmailUser: React.SFC<INoEMailUser> = ({
  addNewEmail,
  isLocked,
  revertCancelEmail,
  isThereUnverifiedEmail,
}) => (
  <div className={styles.content} data-test-id="settings.verify-email-widget.no-email-state">
    <p className={styles.customPaddingTop}>
      <FormattedMessage id="settings.verify-email-widget.enter-email" />
    </p>
    <SetEmailEnhancedForm
      handleSubmit={addNewEmail}
      isLocked={isLocked}
      revertCancelEmail={revertCancelEmail}
      isThereUnverifiedEmail={isThereUnverifiedEmail}
    />
  </div>
);

const VerifiedUser: React.SFC<{ verifiedEmail?: string }> = ({ verifiedEmail }) => (
  <div
    className={cn(styles.content, "d-flex flex-wrap align-content-around")}
    data-test-id="settings.verify-email-widget.verified-email-state"
  >
    <p className={cn(styles.text, "pt-2")}>
      <FormattedMessage id="settings.verify-email-widget.email-is-verified" />
    </p>
    <Col xs={12} className="d-flex justify-content-center" data-test-id="email-verified">
      <p>
        <b>
          <FormattedMessage id="settings.verify-email-widget.verified-email" />:{" "}
        </b>
        {verifiedEmail}
      </p>
    </Col>
  </div>
);

const UnVerifiedUser: React.SFC<{
  resendEmail: () => void;
  verifiedEmail?: string;
  unverifiedEmail?: string;
  cancelEmail: () => void;
}> = ({ resendEmail, verifiedEmail, unverifiedEmail, cancelEmail }) => (
  <div
    className={cn(styles.content, "d-flex flex-wrap align-content-around")}
    data-test-id="settings.verify-email-widget.unverified-email-state"
  >
    {verifiedEmail && (
      <Col xs={12} className="d-flex justify-content-center d-lg-none d-xl-block">
        <p className="mb-0 text-center">
          <b>
            <FormattedMessage id="settings.verify-email-widget.verified-email" />:{" "}
          </b>
          {verifiedEmail}
        </p>
      </Col>
    )}
    {unverifiedEmail && (
      <>
        <Col xs={12} className="d-flex justify-content-center">
          <p className="mb-0 text-center">
            <b>
              <FormattedMessage id="settings.verify-email-widget.unverified-email" />:{" "}
            </b>{" "}
            {unverifiedEmail}
          </p>
        </Col>
      </>
    )}

    <Col xs={12} className="d-flex justify-content-between px-0">
      <Button
        layout={EButtonLayout.SECONDARY}
        className="p-0"
        onClick={cancelEmail}
        data-test-id="verify-email-widget.change-email.button"
      >
        <FormattedMessage id="settings.verify-email-widget.change-email" />
      </Button>
      <Button
        layout={EButtonLayout.SECONDARY}
        className="p-0"
        iconPosition="icon-after"
        svgIcon={arrowRight}
        onClick={resendEmail}
        data-test-id="resend-link"
      >
        <FormattedMessage id="settings.verify-email-widget.resend-link" />
      </Button>
    </Col>
  </div>
);

export const VerifyEmailWidgetComponent: React.SFC<
  IStateProps & IDispatchProps & IOwnProps & IIntlProps
> = ({
  intl: { formatIntlMessage },
  isUserEmailVerified,
  isThereUnverifiedEmail,
  resendEmail,
  verifiedEmail,
  unverifiedEmail,
  addNewEmail,
  isLocked,
  cancelEmail,
  isEmailTemporaryCancelled,
  step,
  revertCancelEmail,
}) => {
  const shouldViewVerifiedUser =
    !isThereUnverifiedEmail && !isEmailTemporaryCancelled && isUserEmailVerified;
  const shouldViewUnVerifiedUser = isThereUnverifiedEmail && !isEmailTemporaryCancelled;
  const shouldViewNoEmail =
    (!isThereUnverifiedEmail && !verifiedEmail) || isEmailTemporaryCancelled;
  return (
    <Panel
      headerText={formatIntlMessage("settings.verify-email-widget.header", { step })}
      rightComponent={
        isUserEmailVerified && !isThereUnverifiedEmail ? (
          <img src={successIcon} className={styles.icon} aria-hidden="true" />
        ) : (
          <img src={warningIcon} className={styles.icon} aria-hidden="true" />
        )
      }
      data-test-id="settings.verify-email-widget"
    >
      {shouldViewVerifiedUser && (
        <VerifiedUser {...{ verifiedEmail, cancelEmail }} data-test-id="verified-section" />
      )}
      {shouldViewUnVerifiedUser && (
        <UnVerifiedUser
          {...{ resendEmail, verifiedEmail, unverifiedEmail, cancelEmail, revertCancelEmail }}
          data-test-id="unverified-section"
        />
      )}
      {shouldViewNoEmail && (
        <NoEmailUser {...{ addNewEmail, isLocked, revertCancelEmail, isThereUnverifiedEmail }} />
      )}
    </Panel>
  );
};

export const VerifyEmailWidget = compose<React.SFC<IOwnProps>>(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: s => ({
      isUserEmailVerified: selectIsUserEmailVerified(s.auth),
      isThereUnverifiedEmail: selectIsThereUnverifiedEmail(s.auth),
      verifiedEmail: selectVerifiedUserEmail(s.auth),
      unverifiedEmail: selectUnverifiedUserEmail(s.auth),
      isLocked: selectIsConnectedButtonLocked(s.verifyEmailWidgetState),
      isEmailTemporaryCancelled: selectIsCancelEmail(s.settings),
    }),
    dispatchToProps: dispatch => ({
      resendEmail: () => {
        dispatch(actions.settings.resendEmail());
      },
      addNewEmail: (values: { email: string }) => {
        dispatch(actions.settings.addNewEmail(values.email));
      },
      cancelEmail: () => {
        dispatch(actions.settings.cancelEmail());
      },
      revertCancelEmail: () => dispatch(actions.settings.revertCancelEmail()),
    }),
  }),
  injectIntlHelpers,
)(VerifyEmailWidgetComponent);
