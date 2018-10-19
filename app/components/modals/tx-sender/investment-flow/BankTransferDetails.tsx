import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import { MONEY_DECIMALS } from "../../../../config/constants";
import { actions } from "../../../../modules/actions";
import {
  selectBankTransferAmount,
  selectBankTransferReferenceCode,
} from "../../../../modules/investment-flow/selectors";
import { selectClientCountry, selectClientName } from "../../../../modules/kyc/selectors";
import { appConnect } from "../../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { formatMoney } from "../../../../utils/Money.utils";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { CheckboxComponent } from "../../../shared/forms";
import { Heading } from "../../../shared/modals/Heading";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { ITxSummaryDispatchProps } from "../TxSender";

import * as styles from "./Summary.module.scss";

interface IStateProps {
  accountName?: string;
  country?: string;
  recipient: string;
  iban: string;
  bic: string;
  referenceCode: string;
  amount: string;
  gasStipend?: boolean;
}

interface IDispatchProps extends ITxSummaryDispatchProps {
  onGasStipendChange: () => void;
}

type IProps = IStateProps & IDispatchProps;

const BankTransferDetailsComponent = injectIntlHelpers(
  ({ onAccept, onGasStipendChange, ...data }: IProps & IIntlProps) => {
    return (
      <Container className={styles.container}>
        <Row className="mt-0">
          <Col>
            <Heading>
              <FormattedMessage id="investment-flow.bank-transfer.direct-bank-transfer" />
            </Heading>
          </Col>
        </Row>

        <Row>
          <Col>
            <p>
              <FormattedMessage id="investment-flow.bank-transfer.general-instructions" />
            </p>
            <FormattedHTMLMessage
              tagName="p"
              id="investment-flow.bank-transfer.bank-details-instructions"
            />
            <p>
              <CheckboxComponent
                checked={data.gasStipend}
                name="gas-stipend"
                label={<FormattedMessage id="investment-flow.bank-transfer.gas-stipend" />}
                onChange={onGasStipendChange}
              />
            </p>
          </Col>
        </Row>

        <Row>
          <Col>
            <Heading>
              <FormattedMessage id="investment-flow.bank-transfer.from-account" />
            </Heading>
          </Col>
        </Row>

        <Row>
          <Col>
            <InfoList>
              <InfoRow
                caption={<FormattedMessage id="investment-flow.bank-transfer.account-name" />}
                value={data.accountName}
              />
              <InfoRow
                caption={<FormattedMessage id="investment-flow.bank-transfer.country" />}
                value={data.country}
              />
            </InfoList>
          </Col>
        </Row>

        <Row>
          <Col>
            <Heading>
              <FormattedMessage id="investment-flow.bank-transfer.to-account" />
            </Heading>
          </Col>
        </Row>

        <Row>
          <Col>
            <InfoList>
              <InfoRow
                caption={<FormattedMessage id="investment-flow.bank-transfer.recipient" />}
                value={data.recipient}
              />
              <InfoRow
                caption={<FormattedMessage id="investment-flow.bank-transfer.iban" />}
                value={data.iban}
              />
              <InfoRow
                caption={<FormattedMessage id="investment-flow.bank-transfer.bic" />}
                value={data.bic}
              />
              <InfoRow
                caption={<FormattedMessage id="investment-flow.bank-transfer.reference-code" />}
                value={data.referenceCode}
              />
              <InfoRow
                caption={<FormattedMessage id="investment-flow.bank-transfer.amount" />}
                value={`€ ${formatMoney(data.amount, MONEY_DECIMALS, 2)}`}
              />
            </InfoList>
          </Col>
        </Row>

        <Row className="justify-content-center mb-0 mt-0">
          <Button layout={EButtonLayout.PRIMARY} type="button" onClick={onAccept}>
            <FormattedMessage id="investment-flow.confirm" />
          </Button>
        </Row>
      </Container>
    );
  },
);

const BankTransferDetails = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => {
    return {
      accountName: selectClientName(state.kyc),
      country: selectClientCountry(state.kyc),
      recipient: "Fifth Force GMBH",
      iban: "DE1250094039446384529400565",
      bic: "TLXXXXXXXXX",
      referenceCode: selectBankTransferReferenceCode(state),
      amount: selectBankTransferAmount(state.investmentFlow),
      gasStipend: state.investmentFlow.bankTransferGasStipend,
    };
  },
  dispatchToProps: d => ({
    onAccept: () => d(actions.investmentFlow.showBankTransferSummary()),
    onGasStipendChange: () => d(actions.investmentFlow.toggleBankTransferGasStipend()),
  }),
})(BankTransferDetailsComponent);

export { BankTransferDetailsComponent, BankTransferDetails };
