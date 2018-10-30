import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { AccountAddress } from "../../shared/AccountAddress";
import { AccountBalance } from "../../shared/AccountBalance";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { IPanelProps } from "../../shared/Panel";
import { IWalletValues, WalletBalanceContainer } from "./WalletBalance";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as neuroIcon from "../../../assets/img/nEUR_icon.svg";
import * as styles from "./WalletBalance.module.scss";

interface IUnlockedWallet extends IPanelProps {
  depositEth: () => void;
  withdrawEth: () => void;
  data: IWalletValues;
  address: string;
}

export const UnlockedWallet: React.SFC<IUnlockedWallet> = ({
  address,
  data,
  depositEth,
  withdrawEth,
  className,
  headerText,
}) => {
  return (
    <WalletBalanceContainer {...{ className, headerText }}>
      <section>
        <h4 className={styles.title}>
          <FormattedMessage id="shared-component.wallet-balance.title.account-address" />
        </h4>
        <AccountAddress address={address} />
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
          onWithdrawClick={withdrawEth}
          // TODO: add on depositClick when euro token flow exists
        />

        <HorizontalLine className="my-3" />

        <AccountBalance
          icon={ethIcon}
          currency="eth"
          currencyTotal="eur"
          largeNumber={data.ethAmount}
          value={data.ethEuroAmount}
          onWithdrawClick={withdrawEth}
          dataTestId="wallet-balance.ether"
          onDepositClick={depositEth}
        />
      </section>
    </WalletBalanceContainer>
  );
};
