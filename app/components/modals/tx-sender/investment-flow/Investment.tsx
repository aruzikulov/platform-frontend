import { BigNumber } from "bignumber.js";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import MaskedInput from "react-text-mask";
import { Col, Container, FormGroup, Label, Row } from "reactstrap";
import { withHandlers, withProps } from "recompose";
import { compose } from "redux";
import { createNumberMask } from "text-mask-addons";

import { Q18 } from "../../../../config/constants";
import { actions } from "../../../../modules/actions";
import {
  EInvestmentCurrency,
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/reducer";
import {
  selectInvestmentErrorState,
  selectInvestmentEthValueUlps,
  selectInvestmentEtoId,
  selectInvestmentEurValueUlps,
  selectInvestmentType,
  selectIsInvestmentInputValidated,
  selectIsReadyToInvest,
} from "../../../../modules/investment-flow/selectors";
import {
  selectEquityTokenCountByEtoId,
  selectEtoTicketSizesById,
  selectNeuRewardUlpsByEtoId,
} from "../../../../modules/investor-tickets/selectors";
import { selectEtoWithCompanyAndContractById } from "../../../../modules/public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../../../modules/public-etos/types";
import {
  selectEtherPriceEur,
  selectEurPriceEther,
} from "../../../../modules/shared/tokenPrice/selectors";
import { EValidationState } from "../../../../modules/tx/sender/reducer";
import { selectTxGasCostEth } from "../../../../modules/tx/sender/selectors";
import { appConnect } from "../../../../store";
import { addBigNumbers, multiplyBigNumbers } from "../../../../utils/BigNumberUtils";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { formatMoney } from "../../../../utils/Money.utils";
import { formatThousands } from "../../../../utils/Number.utils";
import { InfoAlert } from "../../../shared/Alerts";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { FormFieldRaw } from "../../../shared/forms/form-field/FormFieldRaw";
import { Heading } from "../../../shared/modals/Heading";
import { InvestmentTypeSelector, WalletSelectionData } from "./InvestmentTypeSelector";
import {
  createWallets,
  formatEth,
  formatEthTsd,
  formatEur,
  formatEurTsd,
  formatVaryingDecimals,
  getInputErrorMessage,
  getInvestmentTypeMessages,
} from "./utils";

import * as styles from "./Investment.module.scss";

interface IStateProps {
  eto: TEtoWithCompanyAndContract;
  wallets: WalletSelectionData[];
  euroValue: string;
  ethValue: string;
  etherPriceEur: string;
  eurPriceEther: string;
  investmentType?: EInvestmentType;
  gasCostEth: string;
  errorState?: EInvestmentErrorState | EValidationState;
  equityTokenCount?: string;
  neuReward?: string;
  readyToInvest: boolean;
  showTokens: boolean;
  etoTicketSizes?: {
    minTicketEurUlps: BigNumber;
    maxTicketEurUlps: BigNumber;
  };
}

interface IDispatchProps {
  sendTransaction: () => void;
  changeEuroValue: (value: string) => void;
  changeEthValue: (value: string) => void;
  changeInvestmentType: (type: EInvestmentType) => void;
  showBankTransferSummary: () => void;
  investEntireBalance: () => void;
}

interface IWithProps {
  gasCostEuro: string;
  isWalletBalanceKnown: boolean;
  minTicketEth: string;
  minTicketEur: string;
  maxTicketEur: string;
  totalCostEth: string;
  totalCostEur: string;
}

interface IHandlersProps {
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
  maxTicketEur,
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
          <p>
            <FormattedMessage id="investment-flow.amount-to-invest" />
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormFieldRaw
            data-test-id="invest-modal-eur-field"
            prefix="€"
            errorMsg={getInputErrorMessage(
              errorState,
              eto.equityTokenName,
              maxTicketEur,
              minTicketEur,
            )}
            placeholder={`${intl.formatIntlMessage(
              "investment-flow.min-ticket-size",
            )} ${minTicketEur} €`}
            value={formatVaryingDecimals(euroValue)}
            className="form-control"
            renderInput={props => (
              <MaskedInput
                {...props}
                mask={createNumberMask({
                  prefix: "",
                  thousandsSeparatorSymbol: " ",
                  allowDecimal: true,
                  decimalLimit: 2,
                  integerLimit: 20,
                })}
                onChange={e => changeEuroValue(e.target.value)}
              />
            )}
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
            value={formatVaryingDecimals(ethValue)}
            className="form-control"
            renderInput={props => (
              <MaskedInput
                {...props}
                mask={createNumberMask({
                  prefix: "",
                  thousandsSeparatorSymbol: " ",
                  allowDecimal: true,
                  decimalLimit: 4,
                  integerLimit: 15, // integer limit due to weird behavior on large inputs
                })}
                onChange={e => changeEthValue(e.target.value)}
              />
            )}
          />
          {isWalletBalanceKnown && (
            <a
              className={styles.investAll}
              data-test-id="invest-modal-full-balance-btn"
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
                {(showTokens && neuReward && formatEurTsd(neuReward)) || "\xA0"}
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
            <span className={styles.orange} data-test-id="invest-modal-gas-cost">
              {formatEur(gasCostEuro)} € ≈ ETH {formatEth(gasCostEth)}
            </span>
          </div>
          <div>
            <FormattedMessage id="investment-flow.total" />:{" "}
            <span className={styles.orange}>
              {formatEurTsd(totalCostEur)} € ≈ ETH {formatEthTsd(totalCostEth)}
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
      const etoId = selectInvestmentEtoId(state);
      const eto = selectEtoWithCompanyAndContractById(state, etoId)!;
      const eur = selectInvestmentEurValueUlps(state);
      return {
        eto,
        etherPriceEur: selectEtherPriceEur(state),
        eurPriceEther: selectEurPriceEther(state),
        euroValue: eur,
        ethValue: selectInvestmentEthValueUlps(state),
        errorState: selectInvestmentErrorState(state),
        gasCostEth: selectTxGasCostEth(state),
        investmentType: selectInvestmentType(state),
        wallets: createWallets(state),
        neuReward: selectNeuRewardUlpsByEtoId(etoId, state),
        equityTokenCount: selectEquityTokenCountByEtoId(etoId, state),
        showTokens: !!(eur && selectIsInvestmentInputValidated(state)),
        readyToInvest: selectIsReadyToInvest(state),
        etoTicketSizes: selectEtoTicketSizesById(etoId, state),
      };
    },
    dispatchToProps: dispatch => ({
      sendTransaction: () => dispatch(actions.txSender.txSenderAcceptDraft()),
      showBankTransferSummary: () => dispatch(actions.investmentFlow.showBankTransferSummary()),
      changeEthValue: value =>
        dispatch(actions.investmentFlow.submitCurrencyValue(value, EInvestmentCurrency.Ether)),
      changeEuroValue: value =>
        dispatch(actions.investmentFlow.submitCurrencyValue(value, EInvestmentCurrency.Euro)),
      changeInvestmentType: (type: EInvestmentType) =>
        dispatch(actions.investmentFlow.selectInvestmentType(type)),
      investEntireBalance: () => dispatch(actions.investmentFlow.investEntireBalance()),
    }),
  }),
  withProps<IWithProps, IStateProps>(
    ({
      eto,
      ethValue,
      etoTicketSizes,
      investmentType,
      gasCostEth,
      euroValue,
      etherPriceEur,
      eurPriceEther,
    }) => {
      const isBankTransfer = investmentType === EInvestmentType.BankTransfer;
      const gasCostEther = isBankTransfer ? "0" : gasCostEth;
      const gasCostEuro = multiplyBigNumbers([gasCostEther, etherPriceEur]);
      const minTicketEur =
        (etoTicketSizes && etoTicketSizes.minTicketEurUlps.div(Q18).toFixed()) ||
        (eto.minTicketEur && eto.minTicketEur.toString()) ||
        "0";
      const maxTicketEur =
        (etoTicketSizes && etoTicketSizes.maxTicketEurUlps.div(Q18).toFixed()) ||
        (eto.maxTicketEur && eto.maxTicketEur.toString()) ||
        "0";
      return {
        minTicketEur,
        maxTicketEur,
        minTicketEth: multiplyBigNumbers([minTicketEur, eurPriceEther]),
        gasCostEuro,
        gasCostEth: gasCostEther,
        totalCostEth: addBigNumbers([gasCostEther, ethValue || "0"]),
        totalCostEur: addBigNumbers([gasCostEuro, euroValue || "0"]),
        isWalletBalanceKnown: !isBankTransfer,
      };
    },
  ),
  withHandlers<IStateProps & IDispatchProps & IWithProps, IHandlersProps>({
    investNow: ({ investmentType, sendTransaction, showBankTransferSummary }) => () => {
      if (investmentType !== EInvestmentType.BankTransfer) {
        sendTransaction();
      } else {
        showBankTransferSummary();
      }
    },
  }),
)(InvestmentSelectionComponent);
