import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { MONEY_DECIMALS } from "../../../../config/constants";
import { TPublicEtoData } from "../../../../lib/api/eto/EtoApi.interfaces";
import { EInvestmentErrorState, EInvestmentType } from "../../../../modules/investmentFlow/reducer";
import {
  selectLiquidEtherBalance,
  selectLiquidEtherBalanceEuroAmount,
  selectLockedEtherBalance,
  selectLockedEtherBalanceEuroAmount,
  selectLockedEuroTokenBalance,
} from "../../../../modules/wallet/selectors";
import { IAppState } from "../../../../store";
import { compareBigNumbers } from "../../../../utils/BigNumberUtils";
import { formatMoney } from "../../../../utils/Money.utils";
import { WalletSelectionData } from "./InvestmentTypeSelector";

import * as ethIcon from "../../../../assets/img/eth_icon2.svg";
import * as euroIcon from "../../../../assets/img/euro_icon.svg";
import * as neuroIcon from "../../../../assets/img/neuro_icon.svg";

export function createWallets(state: IAppState): WalletSelectionData[] {
  const w = state.wallet;
  const icbmEther = selectLockedEtherBalance(w);
  const icbmNeuro = selectLockedEuroTokenBalance(w);

  const wallets: WalletSelectionData[] = [
    {
      balanceEth: selectLiquidEtherBalance(w),
      balanceEur: selectLiquidEtherBalanceEuroAmount(state),
      type: EInvestmentType.InvestmentWallet,
      name: "Investment Wallet",
      icon: ethIcon,
    },
    {
      type: EInvestmentType.BankTransfer,
      name: "Direct Bank Transfer",
      icon: euroIcon,
    },
  ];

  if (compareBigNumbers(icbmNeuro, 0) > 0) {
    wallets.unshift({
      balanceNEuro: icbmNeuro,
      balanceEur: selectLockedEuroTokenBalance(w),
      type: EInvestmentType.ICBMnEuro,
      name: "ICBM Wallet",
      icon: neuroIcon,
    });
  }

  if (compareBigNumbers(icbmEther, 0) > 0) {
    wallets.unshift({
      balanceEth: icbmEther,
      balanceEur: selectLockedEtherBalanceEuroAmount(state),
      type: EInvestmentType.ICBMEth,
      name: "ICBM Wallet",
      icon: ethIcon,
    });
  }
  return wallets;
}

export function getInputErrorMessage(
  type: EInvestmentErrorState | undefined,
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
  }
}

export function getInvestmentTypeMessages(type: EInvestmentType): React.ReactNode {
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
