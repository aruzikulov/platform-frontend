import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container, Row } from "reactstrap";
import { compose, setDisplayName } from "recompose";

import { MONEY_DECIMALS } from "../../../../config/constants";
import { EEtoDocumentType } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../../modules/actions";
import {
  selectEthValueUlps,
  selectEurValueUlps,
} from "../../../../modules/investmentFlow/selectors";
import {
  selectEquityTokenCountByEtoId,
  selectEtoWithCompanyAndContractById,
  selectNeuRewardUlpsByEtoId,
} from "../../../../modules/public-etos/selectors";
import { selectEtherPriceEur } from "../../../../modules/shared/tokenPrice/selectors";
import { selectTxGasCostEth } from "../../../../modules/tx/sender/selectors";
import { appConnect } from "../../../../store";
import {
  addBigNumbers,
  divideBigNumbers,
  multiplyBigNumbers,
} from "../../../../utils/BigNumberUtils";
import { formatMoney, formatThousands } from "../../../../utils/Money.utils";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { DocumentTemplateButton } from "../../../shared/DocumentLink";
import { Heading } from "../../../shared/modals/Heading";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { ITxSummaryDispatchProps } from "../TxSender";

import * as neuIcon from "../../../../assets/img/neu_icon.svg";
import * as tokenIcon from "../../../../assets/img/token_icon.svg";
import * as styles from "./Summary.module.scss";

interface IStateProps {
  companyName: string;
  etoAddress: string;
  investmentEur: string;
  investmentEth: string;
  gasCostEth: string;
  equityTokens: string;
  estimatedReward: string;
  etherPriceEur: string;
}

type IDispatchProps = ITxSummaryDispatchProps & {
  downloadAgreement: (etoId: string) => void;
};

type IProps = IStateProps & IDispatchProps;

function formatEur(val?: string): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS, 0);
}

function formatEth(val?: string): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS, 4);
}

const InvestmentSummaryComponent = ({
  onAccept,
  downloadAgreement,
  gasCostEth,
  etherPriceEur,
  ...data
}: IProps) => {
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
  const investment = `€ ${formatEur(data.investmentEur)} ≈ ${formatEth(data.investmentEth)} ETH`;

  const gasCostEuro = multiplyBigNumbers([gasCostEth, etherPriceEur]);
  const totalCostEth = addBigNumbers([gasCostEth, data.investmentEth]);
  const totalCostEur = addBigNumbers([gasCostEuro, data.investmentEur]);

  const total = `€ ${formatEur(totalCostEur)} ≈ ${formatEth(totalCostEth)} ETH`;
  const tokenPrice = divideBigNumbers(data.investmentEur, data.equityTokens);

  return (
    <Container className={styles.container}>
      <Row className="mt-0">
        <Heading>
          <FormattedMessage id="investment-flow.investment-summary" />
        </Heading>
      </Row>

      <Row>
        <InfoList>
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.company" />}
            value={data.companyName}
          />
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.token-price" />}
            value={`${formatMoney(tokenPrice, MONEY_DECIMALS, 4)} €`}
          />
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.eto-address" />}
            value={data.etoAddress}
          />
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.your-investment" />}
            value={formatThousands(investment)}
          />
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.transaction-cost" />}
            value={`${formatEth(gasCostEth)} ETH`}
          />
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.equity-tokens" />}
            value={equityTokens}
          />
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.estimated-reward" />}
            value={estimatedReward}
          />
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.transaction-value" />}
            value={total}
          />
        </InfoList>
      </Row>

      <Row className="justify-content-center">
        <DocumentTemplateButton
          onClick={() => downloadAgreement(data.etoAddress)}
          title={<FormattedMessage id="investment-flow.summary.download-agreement" />}
        />
      </Row>

      <Row className="justify-content-center mb-0 mt-0">
        <Button layout={EButtonLayout.PRIMARY} type="button" onClick={onAccept}>
          <FormattedMessage id="investment-flow.confirm" />
        </Button>
      </Row>
    </Container>
  );
};

const InvestmentSummary = compose<IProps, {}>(
  setDisplayName("InvestmentSummary"),
  appConnect<IStateProps, ITxSummaryDispatchProps>({
    stateToProps: state => {
      const i = state.investmentFlow;
      const p = state.publicEtos;

      // eto and computed values are guaranteed to be present at investment summary state
      const eto = selectEtoWithCompanyAndContractById(state, i.etoId)!;

      return {
        companyName: eto.company.name,
        etoAddress: eto.etoId,
        investmentEth: selectEthValueUlps(i),
        investmentEur: selectEurValueUlps(i),
        gasCostEth: selectTxGasCostEth(state.txSender),
        equityTokens: selectEquityTokenCountByEtoId(i.etoId, p) as string,
        estimatedReward: selectNeuRewardUlpsByEtoId(i.etoId, p) as string,
        etherPriceEur: selectEtherPriceEur(state.tokenPrice),
      };
    },
    dispatchToProps: d => ({
      onAccept: () => d(actions.txSender.txSenderAccept()),
      downloadAgreement: (etoId: string) =>
        d(
          actions.publicEtos.downloadPublicEtoDocumentByType(
            etoId,
            EEtoDocumentType.RESERVATION_AND_ACQUISITION_AGREEMENT,
          ),
        ),
    }),
  }),
)(InvestmentSummaryComponent);

export { InvestmentSummaryComponent, InvestmentSummary };
