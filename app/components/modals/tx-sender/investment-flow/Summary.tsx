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
  selectIsICBMInvestment,
} from "../../../../modules/investment-flow/selectors";
import {
  selectEquityTokenCountByEtoId,
  selectNeuRewardUlpsByEtoId,
} from "../../../../modules/investor-tickets/selectors";
import { selectEtoWithCompanyAndContractById } from "../../../../modules/public-etos/selectors";
import { selectEtherPriceEur } from "../../../../modules/shared/tokenPrice/selectors";
import { ETxSenderType } from "../../../../modules/tx/interfaces";
import { selectTxGasCostEth } from "../../../../modules/tx/sender/selectors";
import { appConnect } from "../../../../store";
import {
  addBigNumbers,
  divideBigNumbers,
  multiplyBigNumbers,
} from "../../../../utils/BigNumberUtils";
import { formatMoney } from "../../../../utils/Money.utils";
import { formatThousands } from "../../../../utils/Number.utils";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { CustomTooltip } from "../../../shared/CustomTooltip";
import { DocumentTemplateButton } from "../../../shared/DocumentLink";
import { Heading } from "../../../shared/modals/Heading";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { ITxSummaryDispatchProps } from "../TxSender";
import { formatEth, formatEur } from "./utils";

import * as neuIcon from "../../../../assets/img/neu_icon.svg";
import * as info from "../../../../assets/img/notifications/info.svg";
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
  isIcbm?: boolean;
}

type IDispatchProps = ITxSummaryDispatchProps & {
  downloadAgreement: (etoId: string) => void;
};

type IProps = IStateProps & IDispatchProps;

const NeuRewardCaption: React.SFC<{ isIcbm?: boolean }> = ({ isIcbm }) => {
  const neuMsg = <FormattedMessage id="investment-flow.summary.estimated-reward" />;
  const icbmMsg = (
    <>
      {neuMsg}
      <img className={styles.infoIcon} id="tooltip-target-neu" src={info} />
      <CustomTooltip target="tooltip-target-neu">
        <FormattedMessage id="investment-flow.message.no-icbm-neu-reward" />
      </CustomTooltip>
    </>
  );
  return isIcbm ? icbmMsg : neuMsg;
};

const InvestmentSummaryComponent: React.SFC<IProps> = ({
  onAccept,
  onChange,
  downloadAgreement,
  gasCostEth,
  etherPriceEur,
  isIcbm,
  ...data
}) => {
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
            dataTestId="invest-modal-summary-your-investment"
          />
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.transaction-cost" />}
            value={`${formatEth(gasCostEth)} ETH`}
          />
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.equity-tokens" />}
            value={equityTokens}
          />
          <InfoRow caption={<NeuRewardCaption isIcbm={isIcbm} />} value={estimatedReward} />
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

const InvestmentSummary = compose<IProps, {}>(
  setDisplayName("InvestmentSummary"),
  appConnect<IStateProps, ITxSummaryDispatchProps>({
    stateToProps: state => {
      const i = state.investmentFlow;

      // eto and computed values are guaranteed to be present at investment summary state
      const eto = selectEtoWithCompanyAndContractById(state, i.etoId)!;

      return {
        companyName: eto.company.name,
        etoAddress: eto.etoId,
        investmentEth: selectEthValueUlps(i),
        investmentEur: selectEurValueUlps(i),
        gasCostEth: selectTxGasCostEth(state.txSender),
        equityTokens: selectEquityTokenCountByEtoId(i.etoId, state) as string,
        estimatedReward: selectNeuRewardUlpsByEtoId(i.etoId, state) as string,
        etherPriceEur: selectEtherPriceEur(state.tokenPrice),
        isIcbm: selectIsICBMInvestment(i),
      };
    },
    dispatchToProps: d => ({
      onAccept: () => d(actions.txSender.txSenderAccept()),
      onChange: () => d(actions.txSender.txSenderChange(ETxSenderType.INVEST)),
      downloadAgreement: (etoId: string) =>
        d(
          actions.publicEtos.downloadPublicEtoTemplateByType(
            etoId,
            EEtoDocumentType.RESERVATION_AND_ACQUISITION_AGREEMENT,
          ),
        ),
    }),
  }),
)(InvestmentSummaryComponent);

export { InvestmentSummaryComponent, InvestmentSummary };
