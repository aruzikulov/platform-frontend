import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { MONEY_DECIMALS } from "../../../../config/constants";
import { TPublicEtoData } from "../../../../lib/api/eto/EtoApi.interfaces";
import {
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/reducer";
import { selectInvestmentActiveTypes } from "../../../../modules/investment-flow/selectors";
import {
  selectLiquidEtherBalance,
  selectLiquidEtherBalanceEuroAmount,
  selectLockedEtherBalance,
  selectLockedEtherBalanceEuroAmount,
  selectLockedEuroTokenBalance,
} from "../../../../modules/wallet/selectors";
import { IAppState } from "../../../../store";
import { Dictionary } from "../../../../types";
import { formatMoney } from "../../../../utils/Money.utils";
import { WalletSelectionData } from "./InvestmentTypeSelector";

import * as ethIcon from "../../../../assets/img/eth_icon2.svg";
import * as euroIcon from "../../../../assets/img/euro_icon.svg";
import * as neuroIcon from "../../../../assets/img/neuro_icon.svg";
import { EValidationState } from "../../../../modules/tx/sender/reducer";

export function createWallets(state: IAppState): WalletSelectionData[] {
  const w = state.wallet;
  const icbmEther = selectLockedEtherBalance(w);
  const icbmNeuro = selectLockedEuroTokenBalance(w);

  const wallets: Dictionary<WalletSelectionData> = {
    [EInvestmentType.InvestmentWallet]: {
      balanceEth: selectLiquidEtherBalance(w),
      balanceEur: selectLiquidEtherBalanceEuroAmount(state),
      type: EInvestmentType.InvestmentWallet,
      name: "Investment Wallet",
      icon: ethIcon,
    },
    [EInvestmentType.BankTransfer]: {
      type: EInvestmentType.BankTransfer,
      name: "Direct Bank Transfer",
      icon: euroIcon,
    },
    [EInvestmentType.ICBMnEuro]: {
      type: EInvestmentType.ICBMnEuro,
      name: "ICBM Wallet",
      balanceNEuro: icbmNeuro,
      balanceEur: selectLockedEuroTokenBalance(w),
      icon: neuroIcon,
    },
    [EInvestmentType.ICBMEth]: {
      type: EInvestmentType.ICBMEth,
      name: "ICBM Wallet",
      balanceEth: icbmEther,
      balanceEur: selectLockedEtherBalanceEuroAmount(state),
      icon: ethIcon,
    },
  };

  return selectInvestmentActiveTypes(state.investmentFlow).map(t => wallets[t]);
}

export function getInputErrorMessage(
  type: EInvestmentErrorState | EValidationState | undefined,
  eto: TPublicEtoData,
): React.ReactNode | undefined {
  switch (type) {
    case EInvestmentErrorState.ExceedsTokenAmount:
      return (
        <FormattedMessage
          id="investment-flow.error-message.exceeds-token-amount"
          values={{ tokenName: eto.equityTokenName }}
        />
      );
    case EInvestmentErrorState.AboveMaximumTicketSize:
      return (
        <FormattedMessage
          id="investment-flow.error-message.above-maximum-ticket-size"
          values={{ maxAmount: `€${eto.maxTicketEur || 0}` }}
        />
      );
    case EInvestmentErrorState.BelowMinimumTicketSize:
      return (
        <FormattedMessage
          id="investment-flow.error-message.below-minimum-ticket-size"
          values={{ minAmount: `€${eto.minTicketEur || 0}` }}
        />
      );
    case EInvestmentErrorState.ExceedsWalletBalance:
      return <FormattedMessage id="investment-flow.error-message.exceeds-wallet-balance" />;
    case EValidationState.NOT_ENOUGH_ETHER_FOR_GAS:
      return <FormattedMessage id="modal.txsender.error-message.not-enough-ether-for-gas" />;
  }
}

export function getInvestmentTypeMessages(type?: EInvestmentType): React.ReactNode {
  switch (type) {
    case EInvestmentType.BankTransfer:
      return <FormattedHTMLMessage id="investment-flow.bank-transfer-info-message" tagName="p" />;
  }
}

export function formatEur(val?: string | BigNumber): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS, 0);
}

export function formatEth(val?: string | BigNumber): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS, 4);
}

export function formatVaryingDecimals(val?: string | BigNumber): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS);
}
