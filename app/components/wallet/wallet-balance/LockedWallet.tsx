import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { AccountBalance } from "../../shared/AccountBalance";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { IPanelProps } from "../../shared/Panel";
import { IWalletValues, WalletBalanceContainer } from "./WalletBalance";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as neuroIcon from "../../../assets/img/nEUR_icon.svg";
import * as styles from "./WalletBalance.module.scss";

interface ILockedWallet extends IPanelProps {
  data: IWalletValues;
}

export const LockedWallet: React.SFC<ILockedWallet> = ({ data, className, headerText }) => {
  return (
    <WalletBalanceContainer {...{ className, headerText }}>
      <section className={styles.message}>
        <FormattedMessage id="shared-component.wallet-icbm.already-upgraded-message" />
      </section>

      <section>
        <h4 className={styles.title}>
          <FormattedMessage id="shared-component.wallet-balance.title.account-balance" />
        </h4>
        <AccountBalance
          icon={neuroIcon}
          currency="eur_token"
          currencyTotal="eur"
          largeNumber={data.neuroAmount}
          value={data.neuroEuroAmount}
        />

        <HorizontalLine className="my-3" />

        <AccountBalance
          icon={ethIcon}
          currency="eth"
          currencyTotal="eur"
          largeNumber={data.ethAmount}
          value={data.ethEuroAmount}
        />
      </section>
    </WalletBalanceContainer>
  );
};
