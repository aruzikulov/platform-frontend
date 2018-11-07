import { Form, Formik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";
import { compose, withHandlers } from "recompose";
import { NumberSchema } from "yup";

import { ITxData } from "../../../../lib/web3/types";
import * as YupTS from "../../../../lib/yup-ts";
import { actions } from "../../../../modules/actions";
import { selectStandardGasPrice } from "../../../../modules/gas/selectors";
import { ETxSenderType, IDraftType } from "../../../../modules/tx/interfaces";
import { EValidationState } from "../../../../modules/tx/sender/reducer";
import { selectTxValidationState } from "../../../../modules/tx/sender/selectors";
import { selectMaxAvailableEther } from "../../../../modules/wallet/selectors";
import { doesUserHaveEnoughEther, validateAddress } from "../../../../modules/web3/utils";
import { appConnect } from "../../../../store";
import { SpinningEthereum } from "../../../landing/parts/SpinningEthereum";
import { Button } from "../../../shared/buttons";
import { FormField } from "../../../shared/forms";
import { ValidationErrorMessage } from "../../txSender/shared/ValidationErrorMessage";
import { ITxInitDispatchProps } from "../TxSender";

import * as styles from "./Withdraw.module.scss";

interface IStateProps {
  maxEther: string;
  validationState?: EValidationState;
}

// tslint:disable-next-line:no-unused-variable
interface IFormikProps {
  value: string;
  to: string;
}

interface IHandlersProps {
  onValidateHandler: (value: string, to: string) => void;
}

interface IInternalDispatchProps {
  onValidate: (txDraft: IDraftType) => any;
}

type TProps = IStateProps & ITxInitDispatchProps & IHandlersProps;

const getWithdrawFormSchema = (maxEther: string) =>
  YupTS.object({
    to: YupTS.string().enhance(v =>
      v
        .test(
          "isRequiredField",
          (
            <FormattedMessage id="modals.tx-sender.withdraw-flow.withdraw-component.errors.field-is-required" />
          ) as any,
          (value: string | undefined) => !!value,
        )
        .test(
          "isEthereumAddress",
          (
            <FormattedMessage id="modals.tx-sender.withdraw-flow.withdraw-component.errors.not-ethereum-address" />
          ) as any,
          (value: string) => {
            return validateAddress(value);
          },
        ),
    ),
    value: YupTS.number().enhance((v: NumberSchema) =>
      v
        .moreThan(0)
        .test(
          "isEnoughEther",
          (
            <FormattedMessage id="modals.tx-sender.withdraw-flow.withdraw-component.errors.value-higher-than-balance" />
          ) as any,
          (value: string) => {
            return doesUserHaveEnoughEther(value, maxEther);
          },
        ),
    ),
  }).toYup();

const WithdrawComponent: React.SFC<TProps> = ({
  onAccept,
  maxEther,
  onValidateHandler,
  validationState,
}) => (
  <div>
    <SpinningEthereum />

    <h3 className={styles.title}>
      <FormattedMessage id="modal.sent-eth.title" />
    </h3>

    <Formik<IFormikProps>
      validationSchema={getWithdrawFormSchema(maxEther)}
      isInitialValid={false}
      initialValues={{ value: "", to: "" }}
      onSubmit={onAccept}
    >
      {({ isValid, values, isValidating, setFieldValue }) => {
        return (
          <Form>
            <Container>
              <Row>
                <Col xs={12} className="mb-3">
                  <FormField
                    name="to"
                    label={<FormattedMessage id="modal.sent-eth.to-address" />}
                    placeholder="0x0"
                    ignoreTouched={true}
                    data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.to-address"
                    onChange={(e: any) => {
                      setFieldValue("to", e.target.value);
                      onValidateHandler(values.value, e.target.value);
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} className="mb-3">
                  <FormField
                    name="value"
                    type="number"
                    label={<FormattedMessage id="modal.sent-eth.amount-to-send" />}
                    placeholder="Please enter value in eth"
                    data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.value"
                    ignoreTouched={true}
                    onChange={(e: any) => {
                      setFieldValue("value", e.target.value);
                      onValidateHandler(e.target.value, values.to);
                    }}
                  />
                  {/* @SEE https://github.com/jaredpalmer/formik/issues/288 */}
                  {validationState !== EValidationState.VALIDATION_OK &&
                    isValid &&
                    !isValidating && <ValidationErrorMessage type={validationState} />}
                </Col>
              </Row>
              <Row>
                <Col xs={12} className="mt-3 text-center">
                  <Button
                    type="submit"
                    disabled={
                      !isValid || isValidating || validationState !== EValidationState.VALIDATION_OK
                    }
                    data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"
                  >
                    <FormattedMessage id="modal.sent-eth.button" />
                  </Button>
                </Col>
              </Row>
            </Container>
          </Form>
        );
      }}
    </Formik>
  </div>
);

const Withdraw = compose<TProps, {}>(
  appConnect<IStateProps, ITxInitDispatchProps>({
    stateToProps: state => ({
      maxEther: selectMaxAvailableEther(state),
      gasPrice: selectStandardGasPrice(state),
      validationState: selectTxValidationState(state),
    }),
    dispatchToProps: d => ({
      onAccept: (tx: Partial<ITxData>) => d(actions.txSender.txSenderAcceptDraft(tx)),
      onValidate: (txDraft: IDraftType) => d(actions.txValidator.txSenderValidateDraft(txDraft)),
    }),
  }),
  withHandlers<IStateProps & IInternalDispatchProps, {}>({
    onValidateHandler: ({ onValidate, maxEther }) => (value: string, to: string) => {
      if (doesUserHaveEnoughEther(value, maxEther) && validateAddress(to))
        onValidate({
          to,
          value,
          type: ETxSenderType.WITHDRAW,
        });
    },
  }),
)(WithdrawComponent);

export { Withdraw, WithdrawComponent };
