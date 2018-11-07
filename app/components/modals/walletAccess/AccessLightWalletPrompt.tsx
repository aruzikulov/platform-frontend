import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button, EButtonLayout } from "../../shared/buttons";
import { FormField } from "../../shared/forms";

interface IStateProps {
  isUnlocked: boolean;
}

interface IOwnProps {
  onCancel?: () => void;
  onAccept: (password?: string) => void;
}

type IProps = IStateProps & IOwnProps;

export interface IFormValues {
  password: string;
}

const AccessLightWalletForm = (formikBag: FormikProps<IFormValues> & IProps) => (
  <Form>
    <div className="ml-sm-5 mr-sm-5">
      <FormField
        type="password"
        placeholder="Password"
        name="password"
        data-test-id="access-light-wallet-password-input"
      />
    </div>
    <div className="mt-3">
      <Button
        type="submit"
        layout={EButtonLayout.SECONDARY}
        disabled={!formikBag.values.password}
        data-test-id="access-light-wallet-confirm"
      >
        {" "}
        <FormattedMessage id="modal.light-wallet.button.accept" />
      </Button>
      {formikBag.onCancel && (
        <Button layout={EButtonLayout.SECONDARY} onClick={formikBag.onCancel}>
          <FormattedMessage id="modal.light-wallet.button.reject" />
        </Button>
      )}
    </div>
  </Form>
);

const EnhancedForm = withFormik<IProps, IFormValues>({
  handleSubmit: (values, props) => props.props.onAccept(values.password),
})(AccessLightWalletForm);

export const AccessLightWalletPrompt: React.SFC<IProps> = props =>
  props.isUnlocked ? (
    <div className="mt-3">
      <Button
        onClick={() => props.onAccept()}
        layout={EButtonLayout.SECONDARY}
        data-test-id="access-light-wallet-prompt-accept-button"
      >
        <FormattedMessage id="modal.light-wallet.button.accept" />
      </Button>
      <Button layout={EButtonLayout.SECONDARY} onClick={props.onCancel}>
        <FormattedMessage id="modal.light-wallet.button.reject" />
      </Button>
    </div>
  ) : (
    <div>
      <p>
        <FormattedMessage id="modal.light-wallet.message" />
      </p>
      <EnhancedForm {...props} />
    </div>
  );
