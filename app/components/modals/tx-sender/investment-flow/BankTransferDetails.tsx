import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import * as ReactToPrint from "react-to-print";
import { Col, Container, Row } from "reactstrap";
import { compose, withHandlers } from "recompose";

import { actions } from "../../../../modules/actions";
import {
  selectBankTransferAmount,
  selectBankTransferReferenceCode,
  selectIsBankTransferGasStipend,
} from "../../../../modules/investment-flow/selectors";
import { selectClientCountry, selectClientName } from "../../../../modules/kyc/selectors";
import { appConnect } from "../../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { CopyToClipboard } from "../../../shared/CopyToClipboard";
import { CheckboxComponent } from "../../../shared/forms";
import { Heading } from "../../../shared/modals/Heading";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";

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

interface IDispatchProps {
  onGasStipendChange: () => void;
}

interface IHandlerProps {
  handleCheckbox: (e: any) => void;
}

type IProps = IStateProps & IDispatchProps & IHandlerProps;

const CopyToClipboardLabel: React.SFC<{ label: string }> = ({ label }) => (
  <>
    <CopyToClipboard className={cn(styles.copyToClipboard, styles.nonPrintable)} value={label} />{" "}
    &nbsp; {label}
  </>
);

const BankTransferDetailsComponent = injectIntlHelpers(
  class BankTransferDetailsComponent extends React.Component<IProps & IIntlProps> {
    ref!: HTMLDivElement | null;
    render(): React.ReactNode {
      const { handleCheckbox, ...data } = this.props;
      return (
        <div className={styles.printable} ref={el => (this.ref = el)}>
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
                    onChange={handleCheckbox}
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
                    value={<CopyToClipboardLabel label={data.recipient} />}
                  />
                  <InfoRow
                    caption={<FormattedMessage id="investment-flow.bank-transfer.iban" />}
                    value={<CopyToClipboardLabel label={data.iban} />}
                  />
                  <InfoRow
                    caption={<FormattedMessage id="investment-flow.bank-transfer.bic" />}
                    value={<CopyToClipboardLabel label={data.bic} />}
                  />
                  <InfoRow
                    caption={<FormattedMessage id="investment-flow.bank-transfer.reference-code" />}
                    value={<CopyToClipboardLabel label={data.referenceCode} />}
                  />
                  <InfoRow
                    caption={<FormattedMessage id="investment-flow.bank-transfer.amount" />}
                    value={<CopyToClipboardLabel label={data.amount} />}
                  />
                </InfoList>
              </Col>
            </Row>

            <Row className="justify-content-center mb-0 mt-0">
              <ReactToPrint
                trigger={() => (
                  <Button
                    layout={EButtonLayout.PRIMARY}
                    type="button"
                    className={styles.nonPrintable}
                  >
                    <FormattedMessage id="investment-flow.bank-transfer.print" />
                  </Button>
                )}
                content={() => this.ref}
              />
            </Row>
          </Container>
        </div>
      );
    }
  },
);

const BankTransferDetails = compose<IProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      return {
        accountName: selectClientName(state.kyc),
        country: selectClientCountry(state.kyc),
        recipient: process.env.NF_BANK_TRANSFER_RECIPIENT!,
        iban: process.env.NF_BANK_TRANSFER_IBAN!,
        bic: process.env.NF_BANK_TRANSFER_BIC!,
        referenceCode: selectBankTransferReferenceCode(state),
        amount: selectBankTransferAmount(state),
        gasStipend: selectIsBankTransferGasStipend(state),
      };
    },
    dispatchToProps: d => ({
      onGasStipendChange: () => d(actions.investmentFlow.toggleBankTransferGasStipend()),
    }),
  }),
  withHandlers<IProps, IHandlerProps>({
    handleCheckbox: ({ onGasStipendChange }) => (e: any) => {
      const domEl: HTMLInputElement = e.target;
      // This needs to be done so that the checkbox appears in the print view!
      if (domEl.checked) {
        domEl.setAttribute("checked", "checked");
      } else {
        domEl.removeAttribute("checked");
      }
      onGasStipendChange();
    },
  }),
)(BankTransferDetailsComponent);

export { BankTransferDetailsComponent, BankTransferDetails };
