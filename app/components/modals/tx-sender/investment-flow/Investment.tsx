import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, FormGroup, Label, Row } from "reactstrap";
import { withHandlers, withProps } from "recompose";
import { compose } from "redux";

import { MONEY_DECIMALS } from "../../../../config/constants";
import { TPublicEtoData } from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import {
  EInvestmentCurrency,
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/reducer";
import {
  selectErrorState,
  selectEthValueUlps,
  selectEurValueUlps,
  selectInvestmentGasCostEth,
  selectInvestmentType,
  selectReadyToInvest,
} from "../../../../modules/investment-flow/selectors";
import {
  selectEquityTokenCountByEtoId,
  selectEtoWithCompanyAndContractById,
  selectNeuRewardUlpsByEtoId,
} from "../../../../modules/public-etos/selectors";
import { selectEtherPriceEur } from "../../../../modules/shared/tokenPrice/selectors";
import { appConnect } from "../../../../store";
import {
  addBigNumbers,
  divideBigNumbers,
  multiplyBigNumbers,
  subtractBigNumbers,
} from "../../../../utils/BigNumberUtils";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { formatMoney, formatThousands } from "../../../../utils/Money.utils";
import { InfoAlert } from "../../../shared/Alerts";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { FormFieldRaw } from "../../../shared/forms/form-field/FormFieldRaw";
import { Heading } from "../../../shared/modals/Heading";
import { InvestmentTypeSelector, WalletSelectionData } from "./InvestmentTypeSelector";

import * as styles from "./Investment.module.scss";
import {
  createWallets,
  formatEth,
  formatEur,
  getInputErrorMessage,
  getInvestmentTypeMessages,
} from "./utils";

interface IStateProps {
  eto: TPublicEtoData;
  wallets: WalletSelectionData[];
  euroValue: string;
  ethValue: string;
  etherPriceEur: string;
  investmentType: EInvestmentType;
  gasCostEth: string;
  errorState?: EInvestmentErrorState;
  equityTokenCount?: string;
  neuReward?: string;
  readyToInvest: boolean;
  showTokens: boolean;
}

interface IDispatchProps {
  sendTransaction: () => void;
  changeEuroValue: (value: string) => void;
  changeEthValue: (value: string) => void;
  changeInvestmentType: (type: EInvestmentType) => void;
  showBankTransferDetails: () => void;
}

interface IWithProps {
  gasCostEuro: string;
  isWalletBalanceKnown: boolean;
  minTicketEth: string;
  minTicketEur: number;
  totalCostEth: string;
  totalCostEur: string;
}

interface IHandlersProps {
  investEntireBalance: () => void;
  investNow: () => void;
}

type IProps = IStateProps & IDispatchProps & IIntlProps & IWithProps & IHandlersProps;

export const InvestmentSelectionComponent: React.SFC<IProps> = ({
  changeEthValue,
  changeEuroValue,
  changeInvestmentType,
  equityTokenCount,
  errorState,
  ethValue,
  eto,
  euroValue,
  gasCostEth,
  gasCostEuro,
  intl,
  investEntireBalance,
  investmentType,
  isWalletBalanceKnown,
  minTicketEth,
  minTicketEur,
  neuReward,
  readyToInvest,
  investNow,
  showTokens,
  totalCostEth,
  totalCostEur,
  wallets,
}) => (
  <>
    <Container className={styles.container} fluid>
      <Row className="mt-0">
        <Col>
          <Heading>
            <FormattedMessage id="investment-flow.select-wallet-and-currency" />
          </Heading>
        </Col>
      </Row>
      <Row>
        <InvestmentTypeSelector
          wallets={wallets}
          currentType={investmentType}
          onSelect={changeInvestmentType}
        />
        <Col className={styles.walletInfo}>{getInvestmentTypeMessages(investmentType)}</Col>
      </Row>
      <Row>
        <Col>
          <Heading>
            <FormattedMessage id="investment-flow.calculate-investment" />
          </Heading>
        </Col>
      </Row>
      <Row>
        <Col>
          {errorState === EInvestmentErrorState.NotEnoughEtherForGas ? (
            <p className={styles.error}>
              <FormattedMessage id="investment-flow.error-message.not-enough-ether-for-gas" />
            </p>
          ) : (
            <p>
              <FormattedMessage id="investment-flow.amount-to-invest" />
            </p>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <FormFieldRaw
            data-test-id="invest-modal-eur-field"
            prefix="€"
            errorMsg={getInputErrorMessage(errorState, eto)}
            placeholder={`${intl.formatIntlMessage(
              "investment-flow.min-ticket-size",
            )} ${minTicketEur} €`}
            controlCursor
            value={formatEur(euroValue)}
            onChange={e => changeEuroValue(e.target.value)}
          />
        </Col>
        <Col sm="1">
          <div className={styles.equals}>≈</div>
        </Col>
        <Col>
          <FormFieldRaw
            data-test-id="invest-modal-eth-field"
            prefix="ETH"
            placeholder={`${intl.formatIntlMessage(
              "investment-flow.min-ticket-size",
            )} ${formatMoney(minTicketEth, 0, 4)} ETH`}
            controlCursor
            value={formatEth(ethValue)}
            onChange={e => changeEthValue(e.target.value)}
          />
          {isWalletBalanceKnown && (
            <a
              className={styles.investAll}
              href="#"
              onClick={e => {
                e.preventDefault();
                investEntireBalance();
              }}
            >
              <FormattedMessage id="investment-flow.invest-entire-balance" />
            </a>
          )}
        </Col>
      </Row>
    </Container>
    <section className={styles.green}>
      <Container className={styles.container} fluid>
        <Row>
          <Col>
            <FormGroup>
              <Label>
                <FormattedMessage id="investment-flow.equity-tokens" />
              </Label>
              <InfoAlert>
                {(showTokens && equityTokenCount && formatThousands(equityTokenCount.toString())) ||
                  "\xA0" /* non breaking space*/}
              </InfoAlert>
            </FormGroup>
          </Col>
          <Col sm="1" />
          <Col>
            <FormGroup>
              <Label>
                <FormattedMessage id="investment-flow.estimated-neu-tokens" />
              </Label>
              <InfoAlert>
                {(showTokens && neuReward && formatThousands(formatEth(neuReward))) || "\xA0"}
              </InfoAlert>
            </FormGroup>
          </Col>
        </Row>
      </Container>
    </section>
    <Container className={styles.container} fluid>
      <Row>
        <Col className={styles.summary}>
          <div>
            + <FormattedMessage id="investment-flow.estimated-gas-cost" />:{" "}
            <span className={styles.orange}>
              {formatEur(gasCostEuro)} € ≈ ETH {formatEth(gasCostEth)}
            </span>
          </div>
          <div>
            <FormattedMessage id="investment-flow.total" />:{" "}
            <span className={styles.orange}>
              {formatThousands(formatEur(totalCostEur))} € ≈ ETH{" "}
              {formatThousands(formatEth(totalCostEth))}
            </span>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center mb-0">
        <Button
          onClick={investNow}
          layout={EButtonLayout.PRIMARY}
          type="submit"
          disabled={!readyToInvest}
          data-test-id="invest-modal-invest-now-button"
        >
          <FormattedMessage id="investment-flow.invest-now" />
        </Button>
      </Row>
    </Container>
  </>
);

export const InvestmentSelection: React.SFC = compose<any>(
  injectIntlHelpers,
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const investmentFlow = state.investmentFlow;

      const eto = selectEtoWithCompanyAndContractById(state, investmentFlow.etoId)!;
      const eur = selectEurValueUlps(investmentFlow);
      return {
        eto,
        etherPriceEur: selectEtherPriceEur(state.tokenPrice),
        euroValue: eur,
        ethValue: selectEthValueUlps(investmentFlow),
        errorState: selectErrorState(investmentFlow),
        gasCostEth: selectInvestmentGasCostEth(state.investmentFlow),
        investmentType: selectInvestmentType(investmentFlow),
        wallets: createWallets(state),
        neuReward: selectNeuRewardUlpsByEtoId(investmentFlow.etoId, state.publicEtos),
        equityTokenCount: selectEquityTokenCountByEtoId(investmentFlow.etoId, state.publicEtos),
        showTokens: !!(eur && investmentFlow.isValidatedInput),
        readyToInvest: selectReadyToInvest(state.investmentFlow),
      };
    },
    dispatchToProps: dispatch => ({
      sendTransaction: () => dispatch(actions.txSender.txSenderAcceptDraft()),
      showBankTransferDetails: () => dispatch(actions.investmentFlow.showBankTransferDetails()),
      changeEthValue: value =>
        dispatch(actions.investmentFlow.submitCurrencyValue(value, EInvestmentCurrency.Ether)),
      changeEuroValue: value =>
        dispatch(actions.investmentFlow.submitCurrencyValue(value, EInvestmentCurrency.Euro)),
      changeInvestmentType: (type: EInvestmentType) =>
        dispatch(actions.investmentFlow.selectInvestmentType(type)),
    }),
  }),
  withProps<IWithProps, IStateProps>(
    ({ eto, ethValue, investmentType, gasCostEth, euroValue, etherPriceEur }) => {
      const gasCostEuro = multiplyBigNumbers([gasCostEth, etherPriceEur]);
      const minTicketEur = eto.minTicketEur || 0;

      return {
        gasCostEuro,
        minTicketEur,
        minTicketEth: divideBigNumbers(minTicketEur, etherPriceEur),
        totalCostEth: addBigNumbers([gasCostEth, ethValue || "0"]),
        totalCostEur: addBigNumbers([gasCostEuro, euroValue || "0"]),
        isWalletBalanceKnown: investmentType !== EInvestmentType.BankTransfer,
      };
    },
  ),
  withHandlers<IStateProps & IDispatchProps & IWithProps, IHandlersProps>({
    investEntireBalance: ({ investmentType, wallets, changeEuroValue, gasCostEuro }) => () => {
      const wallet = wallets.find(w => w.type === investmentType);

      if (wallet === undefined || wallet.type === EInvestmentType.BankTransfer) {
        throw new Error("Can't invest wallet entire balance. Wallet not found.");
      }

      const availableEurBalance = subtractBigNumbers([wallet.balanceEur, gasCostEuro]);
      const balanceEurFormatted = formatMoney(availableEurBalance, MONEY_DECIMALS);

      changeEuroValue(balanceEurFormatted);
    },
    investNow: ({ investmentType, sendTransaction, showBankTransferDetails }) => () => {
      if (investmentType !== EInvestmentType.BankTransfer) {
        sendTransaction();
      } else {
        showBankTransferDetails();
      }
    },
  }),
)(InvestmentSelectionComponent);
