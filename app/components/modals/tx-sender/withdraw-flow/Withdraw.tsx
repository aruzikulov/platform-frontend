import { Form, Formik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";
import { compose } from "recompose";
import * as Web3Utils from "web3-utils";
import { NumberSchema } from "yup";

import { ITxData } from "../../../../lib/web3/Web3Manager";
import * as YupTS from "../../../../lib/yup-ts";
import { actions } from "../../../../modules/actions";
import { selectStandardGasPrice } from "../../../../modules/gas/selectors";
import { ETxSenderType, IDraftType } from "../../../../modules/tx/interfaces";
import { EValidationState } from "../../../../modules/tx/sender/reducer";
import { selectTxGasCostEth, selectValidationState } from "../../../../modules/tx/sender/selectors";
import { selectLiquidEtherBalance } from "../../../../modules/wallet/selectors";
import { appConnect } from "../../../../store";
import { compareBigNumbers, subtractBigNumbers } from "../../../../utils/BigNumberUtils";
import { convertToBigInt } from "../../../../utils/Number.utils";
import { SpinningEthereum } from "../../../landing/parts/SpinningEthereum";
import { Button } from "../../../shared/buttons";
import { ValidationErrorMessage } from "../../txSender/shared/ValidationErrorMessage";
import { ITxInitDispatchProps } from "../TxSender";

import { FormField } from "../../../shared/forms";
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

type TProps = IStateProps & ITxInitDispatchProps;

const withdrawFormSchema = YupTS.object({
  to: YupTS.string().enhance(v =>
    v
      .test("isEthereumAddress", "is not a valid Ethereum address", (value: string) => {
        return Web3Utils.isAddress(value);
      })
      .required(),
  ),
  value: YupTS.number().enhance((v: NumberSchema) => v.moreThan(0).required()),
});
const withdrawFormValidator = withdrawFormSchema.toYup();

const WithdrawComponent: React.SFC<TProps> = ({
  onAccept,
  maxEther,
  onValidate,
  validationState,
}) => (
  <div>
    <SpinningEthereum />

    <h3 className={styles.title}>
      <FormattedMessage id="modal.sent-eth.title" />
    </h3>

    <Formik<IFormikProps>
      validationSchema={withdrawFormValidator}
      isInitialValid={false}
      initialValues={{ value: "", to: "" }}
      onSubmit={onAccept}
    >
      {({ isValid, values, isValidating, setFieldValue, validateField }) => {
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
                    validate={() => {
                      if (compareBigNumbers(convertToBigInt(values.value || "0"), maxEther) > 0)
                        return (
                          <FormattedMessage id="modals.tx-sender.withdraw-flow.withdraw-component.errors.value-higher-than-balance" />
                        );
                    }}
                    onChange={(e: any) => {
                      setFieldValue("value", e.target.value);
                      validateField("value");
                      onValidate({
                        ...values,
                        value: e.target.value,
                        type: ETxSenderType.WITHDRAW,
                      });
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
      maxEther: subtractBigNumbers([
        selectLiquidEtherBalance(state.wallet),
        selectTxGasCostEth(state.txSender),
      ]),
      gasPrice: selectStandardGasPrice(state),
      validationState: selectValidationState(state.txSender),
    }),
    dispatchToProps: d => ({
      onAccept: (tx: Partial<ITxData>) => d(actions.txSender.txSenderAcceptDraft(tx)),
      onValidate: (txDraft: IDraftType) => d(actions.txSender.txSenderValidateDraft(txDraft)),
    }),
  }),
)(WithdrawComponent);

export { Withdraw, WithdrawComponent };
