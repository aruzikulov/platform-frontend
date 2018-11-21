import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";
import { compose, setDisplayName } from "recompose";

import { TEtoSpecsData } from "../../../../lib/api/eto/EtoApi.interfaces";
import { EEtoDocumentType } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { getShareAndTokenPrice } from "../../../../lib/api/eto/EtoUtils";
import { actions } from "../../../../modules/actions";
import {
  selectInvestmentEtoId,
  selectInvestmentEurValueUlps,
} from "../../../../modules/investment-flow/selectors";
import {
  selectEquityTokenCountByEtoId,
  selectNeuRewardUlpsByEtoId,
} from "../../../../modules/investor-tickets/selectors";
import { selectEtoWithCompanyAndContractById } from "../../../../modules/public-etos/selectors";
import { ETxSenderType } from "../../../../modules/tx/interfaces";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { DocumentTemplateButton } from "../../../shared/DocumentLink";
import { Heading } from "../../../shared/modals/Heading";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { ITxSummaryDispatchProps } from "../TxSender";
import { formatEurTsd, formatSummaryTokenPrice, getActualTokenPriceEur } from "./utils";

import * as neuIcon from "../../../../assets/img/neu_icon.svg";
import * as tokenIcon from "../../../../assets/img/token_icon.svg";
import * as styles from "./Summary.module.scss";

interface IDispatchProps extends ITxSummaryDispatchProps {
  downloadAgreement: (etoId: string) => void;
}

interface IStateProps {
  eto: TEtoSpecsData;
  companyName: string;
  investmentEur: string;
  equityTokens: string;
  estimatedReward: string;
}

type IProps = IStateProps & IDispatchProps;

const BankTransferSummaryComponent: React.SFC<IProps> = ({
  eto,
  investmentEur,
  companyName,
  downloadAgreement,
  onAccept,
  onChange,
  equityTokens,
  estimatedReward,
}) => {
  const equityTokensValue = (
    <span>
      {/* TODO: Change to actual custom token icon */}
      <img src={tokenIcon} /> {equityTokens}
    </span>
  );
  const estimatedRewardValue = (
    <span>
      <img src={neuIcon} /> {formatEurTsd(estimatedReward)} NEU
    </span>
  );

  const actualTokenPrice = getActualTokenPriceEur(investmentEur, equityTokens);
  const { tokenPrice: fullTokenPrice } = getShareAndTokenPrice(eto);
  const formattedTokenPrice = `€ ${formatSummaryTokenPrice(
    fullTokenPrice,
    parseFloat(actualTokenPrice),
  )}`;

  return (
    <Container className={styles.container}>
      <Row className="mt-0">
        <Col>
          <Heading>
            <FormattedMessage id="investment-flow.investment-summary" />
          </Heading>
        </Col>
      </Row>

      <Row>
        <Col>
          <p>
            <FormattedMessage id="investment-flow.bank-transfer-summary.explanation" />
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <InfoList>
            <InfoRow
              caption={<FormattedMessage id="investment-flow.summary.company" />}
              value={companyName}
            />
            <InfoRow
              caption={<FormattedMessage id="investment-flow.summary.token-price" />}
              value={formattedTokenPrice}
            />
            <InfoRow
              caption={
                <FormattedMessage id="investment-flow.bank-transfer-summary.estimated-investment" />
              }
              value={`${formatEurTsd(investmentEur)} €`}
              dataTestId="invest-modal-bank-transfer-summary-amount"
            />
            <InfoRow
              caption={
                <FormattedMessage id="investment-flow.bank-transfer-summary.equity-tokens" />
              }
              value={equityTokensValue}
            />
            <InfoRow
              caption={<FormattedMessage id="investment-flow.bank-transfer-summary.neu-reward" />}
              value={estimatedRewardValue}
            />
          </InfoList>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <DocumentTemplateButton
          onClick={() => downloadAgreement(eto.etoId)}
          title={<FormattedMessage id="investment-flow.summary.download-agreement" />}
        />
      </Row>

      <Row className="justify-content-center mb-0 mt-0">
        <Button
          layout={EButtonLayout.PRIMARY}
          type="button"
          onClick={onAccept}
          data-test-id="invest-modal-summary-confirm-button"
        >
          <FormattedMessage id="investment-flow.confirm" />
        </Button>
        <Button
          layout={EButtonLayout.SECONDARY}
          type="button"
          onClick={onChange}
          data-test-id="invest-modal-summary-change-button"
        >
          <FormattedMessage id="investment-flow.change" />
        </Button>
      </Row>
    </Container>
  );
};

const BankTransferSummary = compose<IProps, {}>(
  setDisplayName("BankTransferSummary"),
  appConnect<IStateProps, ITxSummaryDispatchProps>({
    stateToProps: state => {
      const etoId = selectInvestmentEtoId(state);
      // eto and computed values are guaranteed to be present at investment summary state
      const eto = selectEtoWithCompanyAndContractById(state, etoId)!;
      return {
        eto,
        companyName: eto.company.name,
        investmentEur: selectInvestmentEurValueUlps(state),
        // tslint:disable: no-useless-cast
        equityTokens: selectEquityTokenCountByEtoId(etoId, state)!,
        estimatedReward: selectNeuRewardUlpsByEtoId(etoId, state)!,
      };
    },
    dispatchToProps: d => ({
      onAccept: () => d(actions.investmentFlow.showBankTransferDetails()),
      onChange: () => d(actions.investmentFlow.changeBankTransfer(ETxSenderType.INVEST)),
      downloadAgreement: (etoId: string) =>
        d(
          actions.publicEtos.downloadPublicEtoTemplateByType(
            etoId,
            EEtoDocumentType.RESERVATION_AND_ACQUISITION_AGREEMENT,
          ),
        ),
    }),
  }),
)(BankTransferSummaryComponent);

export { BankTransferSummaryComponent, BankTransferSummary };
