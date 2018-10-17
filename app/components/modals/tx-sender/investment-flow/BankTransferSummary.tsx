import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";
import { compose, setDisplayName } from "recompose";

import { MONEY_DECIMALS } from "../../../../config/constants";
import { EEtoDocumentType } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../../modules/actions";
import { selectEurValueUlps } from "../../../../modules/investment-flow/selectors";
import {
  selectEquityTokenCountByEtoId,
  selectEtoWithCompanyAndContractById,
  selectNeuRewardUlpsByEtoId,
} from "../../../../modules/public-etos/selectors";
import { appConnect } from "../../../../store";
import { divideBigNumbers } from "../../../../utils/BigNumberUtils";
import { formatMoney } from "../../../../utils/Money.utils";
import { DocumentTemplateButton } from "../../../shared/DocumentLink";
import { Heading } from "../../../shared/modals/Heading";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { formatEur } from "./utils";

import * as neuIcon from "../../../../assets/img/neu_icon.svg";
import * as tokenIcon from "../../../../assets/img/token_icon.svg";
import * as styles from "./Summary.module.scss";

type IDispatchProps = {
  downloadAgreement: (etoId: string) => void;
};

interface IStateProps {
  companyName: string;
  investmentEur: string;
  equityTokens: string;
  estimatedReward: string;
  etoAddress: string;
}

type IProps = IStateProps & IDispatchProps;

const BankTransferSummaryComponent = ({
  investmentEur,
  companyName,
  downloadAgreement,
  ...data
}: IStateProps & IDispatchProps) => {
  const equityTokens = (
    <span>
      {/* TODO: Change to actual custom token icon */}
      <img src={tokenIcon} /> {data.equityTokens}
    </span>
  );
  const estimatedReward = (
    <span>
      <img src={neuIcon} /> {formatEur(data.estimatedReward)} NEU
    </span>
  );

  const tokenPrice = divideBigNumbers(investmentEur, data.equityTokens);

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
              value={`${formatMoney(tokenPrice, MONEY_DECIMALS, 2)} €`}
            />
            <InfoRow
              caption={
                <FormattedMessage id="investment-flow.bank-transfer-summary.estimated-investment" />
              }
              value={`${formatEur(investmentEur)} €`}
            />
            <InfoRow
              caption={
                <FormattedMessage id="investment-flow.bank-transfer-summary.equity-tokens" />
              }
              value={equityTokens}
            />
            <InfoRow
              caption={<FormattedMessage id="investment-flow.bank-transfer-summary.neu-reward" />}
              value={estimatedReward}
            />
          </InfoList>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <DocumentTemplateButton
          onClick={() => downloadAgreement(data.etoAddress)}
          title={<FormattedMessage id="investment-flow.summary.download-agreement" />}
        />
      </Row>
    </Container>
  );
};

const BankTransferSummary = compose<IProps, {}>(
  setDisplayName("BankTransferSummary"),
  appConnect<IStateProps>({
    stateToProps: state => {
      const i = state.investmentFlow;
      const p = state.publicEtos;
      // eto and computed values are guaranteed to be present at investment summary state
      const eto = selectEtoWithCompanyAndContractById(state, i.etoId)!;
      return {
        etoAddress: eto.etoId,
        companyName: eto.company.name,
        investmentEur: selectEurValueUlps(i),
        equityTokens: selectEquityTokenCountByEtoId(i.etoId, p) as string,
        estimatedReward: selectNeuRewardUlpsByEtoId(i.etoId, p) as string,
      };
    },
    dispatchToProps: d => ({
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
