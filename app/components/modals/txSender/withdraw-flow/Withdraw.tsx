import { Form, Formik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import * as Web3Utils from "web3-utils";
import { NumberSchema } from "yup";

import { ITxInitData } from "../../../../lib/web3/Web3Manager";
import * as YupTS from "../../../../lib/yup-ts";
import { actions } from "../../../../modules/actions";
import { IGasState } from "../../../../modules/gas/reducer";
import { appConnect } from "../../../../store";
import { SpinningEthereum } from "../../../landing/parts/SpinningEthereum";
import { Button } from "../../../shared/buttons";
import { FormFieldImportant } from "../../../shared/forms/formField/FormFieldImportant";
import { LoadingIndicator } from "../../../shared/LoadingIndicator";
import { WarningAlert } from "../../../shared/WarningAlert";
import { ITxInitDispatchProps } from "../TxSender";

import * as styles from "./Withdraw.module.scss";

interface IStateProps {

}

const withdrawFormSchema = YupTS.object({
  to: YupTS.string().enhance(v => v.test("isEtheriumAddress", "is not a valid etherium address", Web3Utils.isAddress)),
  value: YupTS.number().enhance((v: NumberSchema) => v.positive()),
  gas: YupTS.string(),
});
const withdrawFormValidator = withdrawFormSchema.toYup();

export const WithdrawComponent: React.SFC<ITxInitDispatchProps> = ({
  onAccept,
}) => (
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
        const value = Web3Utils.toWei(data.value, "ether");
        onAccept({ ...data, value });
      }}
    >
      {({ isValid }) => (
        <Form>
          <Row>
            <Col xs={12} className="mb-3">
              <FormFieldImportant
                name="to"
                label={<FormattedMessage id="modal.sent-eth.to-address" />}
                placeholder="0x0"
                data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.to-address"
              />
            </Col>

            <Col xs={12} className="mb-3">
              <FormFieldImportant
                name="value"
                label={<FormattedMessage id="modal.sent-eth.amount-to-send" />}
                placeholder="Please enter value in eth"
                data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.value"
              />
            </Col>

            <Col xs={12} className="text-center">
              <Button
                type="submit"
                disabled={!isValid}
                data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"
              >
                <FormattedMessage id="modal.sent-eth.button" />
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  </div>
);

export const GasComponent: React.SFC<IGasState> = ({ gasPrice, error }) => {
  if (error) {
    return (
      <WarningAlert>
        <FormattedMessage id="tx-sender.withdraw.error" />
      </WarningAlert>
    );
  }

  if (gasPrice) {
    return <GweiFormatter value={gasPrice.standard} />;
  }

  return <LoadingIndicator light />;
};

export const Withdraw = appConnect<IStateProps, ITxInitDispatchProps>({
  stateToProps: state => ({
  }),
  dispatchToProps: d => ({
    onAccept: (tx: ITxInitData) => d(actions.txSender.txSenderAcceptDraft(tx)),
  }),
})(WithdrawComponent);

export const GweiFormatter: React.SFC<{ value: string }> = ({ value }) => (
  <div data-test-id="modals.tx-sender.withdraw-flow.gwei-formatter-component.gas-price">
    {Web3Utils.fromWei(value, "gwei")} Gwei
  </div>
);
