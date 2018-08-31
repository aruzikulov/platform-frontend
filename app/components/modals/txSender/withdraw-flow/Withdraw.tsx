import { Form, Formik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import * as Web3Utils from "web3-utils";

import * as YupTS from "../../../../lib/yup-ts";
import { actions } from "../../../../modules/actions";
import { IGasState } from "../../../../modules/gas/reducer";
import { ITxData } from "../../../../modules/tx/sender/reducer";
import { selectEthereumAddressWithChecksum } from "../../../../modules/web3/selectors";
import { appConnect } from "../../../../store";
import { SpinningEthereum } from "../../../landing/parts/SpinningEthereum";
import { Button } from "../../../shared/Buttons";
import { FormFieldImportant } from "../../../shared/forms/formField/FormFieldImportant";
import { FormLabel } from "../../../shared/forms/formField/FormLabel";
import { LoadingIndicator } from "../../../shared/LoadingIndicator";
import { WarningAlert } from "../../../shared/WarningAlert";
import { ITxInitDispatchProps } from "../TxSender";

import * as styles from "./Withdraw.module.scss";

interface IWithdrawStateProps {
  gas: IGasState;
  address: string;
}

const withdrawFormSchema = YupTS.object({
  to: YupTS.string(),
  value: YupTS.string(),
  gas: YupTS.string(),
});
const withdrawFormValidator = withdrawFormSchema.toYup();

export const WithdrawComponent: React.SFC<IWithdrawStateProps & ITxInitDispatchProps> = ({
  onAccept,
  gas,
  address,
}) => (
  <div>
    <SpinningEthereum />

    <h3 className={styles.title}>
      <FormattedMessage id="modal.sent-eth.title" />
    </h3>

    <Formik<{}, Partial<ITxData>>
      validationSchema={withdrawFormValidator}
      isInitialValid={false}
      initialValues={{ gas: "21000" }}
      onSubmit={data => {
        const gasPrice = gas.gasPrice!.standard;
        const value = Web3Utils.toWei(data.value, "ether");
        const from = address;

        onAccept({ ...data, gasPrice, value, from });
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
              />
            </Col>

            <Col xs={12} className="mb-3">
              <FormFieldImportant
                name="value"
                label={<FormattedMessage id="modal.sent-eth.amount-to-send" />}
                placeholder="10.5"
              />
            </Col>

            <Col xs={12} className="mb-4">
              <FormFieldImportant
                name="gas"
                label={<FormattedMessage id="modal.sent-eth.gas-limit" />}
              />
            </Col>

            <Col xs={12} className="mb-4">
              <FormLabel>
                <FormattedMessage id="modal.sent-eth.gas-price" />
              </FormLabel>
              <GasComponent {...gas} />
            </Col>

            <Col xs={12} className="text-center">
              <Button type="submit" disabled={(gas.loading && !gas.error) || !isValid}>
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

export const Withdraw = appConnect<IWithdrawStateProps, ITxInitDispatchProps>({
  stateToProps: state => ({
    gas: state.gas,
    address: selectEthereumAddressWithChecksum(state.web3),
  }),
  dispatchToProps: d => ({
    onAccept: (tx: Partial<ITxData>) => d(actions.txSender.txSenderAcceptDraft(tx)),
  })
})(WithdrawComponent);

export const GweiFormatter: React.SFC<{ value: string }> = ({ value }) => (
  <div>{Web3Utils.fromWei(value, "gwei")} Gwei</div>
);
