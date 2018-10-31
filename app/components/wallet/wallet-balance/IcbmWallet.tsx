import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { AccountBalance } from "../../shared/AccountBalance";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { IPanelProps } from "../../shared/Panel";
import { IWalletValues, WalletBalanceContainer } from "./WalletBalance";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as neuroIcon from "../../../assets/img/nEUR_icon.svg";
import * as styles from "./WalletBalance.module.scss";

export interface IIcbmWalletValues extends IWalletValues {
  hasFunds: boolean;
  isEtherUpgradeTargetSet: boolean;
  isEuroUpgradeTargetSet: boolean;
}

interface IIcbmWallet extends IPanelProps {
  onUpgradeEtherClick?: () => void;
  onUpgradeEuroClick?: () => void;
  data: IIcbmWalletValues;
}

export const IcbmWallet: React.SFC<IIcbmWallet> = ({
  data,
  className,
  headerText,
  onUpgradeEtherClick,
  onUpgradeEuroClick,
}) => {
  return (
    <WalletBalanceContainer {...{ className, headerText }}>
      <section className={styles.message}>
        <FormattedMessage id="shared-component.wallet-icbm.upgrade-message" />
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
          onUpgradeClick={data.neuroEuroAmount === "0" ? undefined : onUpgradeEuroClick}
          disabled={!data.isEuroUpgradeTargetSet}
        />

        <HorizontalLine className="my-3" />

        <AccountBalance
          icon={ethIcon}
          currency="eth"
          currencyTotal="eur"
          largeNumber={data.ethAmount}
          value={data.ethEuroAmount}
          onUpgradeClick={data.ethEuroAmount === "0" ? undefined : onUpgradeEtherClick}
          disabled={!data.isEtherUpgradeTargetSet}
        />
      </section>
    </WalletBalanceContainer>
  );
};
