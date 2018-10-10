import { Form, Formik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";
import { compose } from "recompose";
import * as Web3Utils from "web3-utils";
import { NumberSchema } from "yup";

import { ITxInitData } from "../../../../lib/web3/Web3Manager";
import * as YupTS from "../../../../lib/yup-ts";
import { actions } from "../../../../modules/actions";
import { selectTxGasCostEth } from "../../../../modules/tx/sender/selectors";
import { selectLiquidEtherBalance } from "../../../../modules/wallet/selectors";
import { appConnect } from "../../../../store";
import { compareBigNumbers, subtractBigNumbers } from "../../../../utils/BigNumberUtils";
import { convertToBigInt } from "../../../../utils/Money.utils";
import { SpinningEthereum } from "../../../landing/parts/SpinningEthereum";
import { Button } from "../../../shared/buttons";
import { FormFieldImportant } from "../../../shared/forms/formField/FormFieldImportant";
import { ITxInitDispatchProps } from "../TxSender";

import * as styles from "./Withdraw.module.scss";

interface IStateProps {
  maxEther: string;
}

type TProps = IStateProps & ITxInitDispatchProps;

const withdrawFormSchema = YupTS.object({
  to: YupTS.string().enhance(v =>
    v.test("isEthereumAddress", "is not a valid Ethereum address", Web3Utils.isAddress),
  ),
  value: YupTS.number().enhance((v: NumberSchema) => v.positive()),
});
const withdrawFormValidator = withdrawFormSchema.toYup();

const WithdrawComponent: React.SFC<TProps> = ({ onAccept, maxEther }) => (
  <div>
    <SpinningEthereum />

    <h3 className={styles.title}>
      <FormattedMessage id="modal.sent-eth.title" />
    </h3>

    <Formik<ITxInitData>
      validationSchema={withdrawFormValidator}
      isInitialValid={false}
      initialValues={{ value: "", to: "", from: "" }}
      onSubmit={data => {
        const value = Web3Utils.toWei(data.value.toString(), "ether");
        onAccept({ ...data, value });
      }}
    >
      {({ isValid, values }) => {
        const ethAboveBalance =
          compareBigNumbers(convertToBigInt(values.value || "0"), maxEther) > 0;
        return (
          <Form>
            <Container>
              <Row>
                <Col xs={12} className="mb-3">
                  <FormFieldImportant
                    name="to"
                    label={<FormattedMessage id="modal.sent-eth.to-address" />}
                    placeholder="0x0"
                    data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.to-address"
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} className="mb-3">
                  <FormFieldImportant
                    name="value"
                    type="number"
                    label={<FormattedMessage id="modal.sent-eth.amount-to-send" />}
                    placeholder="Please enter value in eth"
                    data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.value"
                    errorMessage={
                      ethAboveBalance ? (
                        <FormattedMessage id="modals.tx-sender.withdraw-flow.withdraw-component.errors.value-higher-than-balance" />
                      ) : (
                        undefined
                      )
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} className="mt-3 text-center">
                  <Button
                    type="submit"
                    disabled={!isValid || ethAboveBalance}
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
    }),
    dispatchToProps: d => ({
      onAccept: (tx: ITxInitData) => d(actions.txSender.txSenderAcceptDraft(tx)),
    }),
  }),
)(WithdrawComponent);

export { Withdraw, WithdrawComponent };
