import * as React from "react";
import * as styles from "./DepositEth.module.scss";
import { DepositFunds } from "./DepositFunds";

import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";
import * as icon from "../../../../assets/img/eth_icon.svg";
import { selectEthereumAddressWithChecksum } from "../../../../modules/web3/selectors";
import { appConnect } from "../../../../store";

interface IProps {
  path: string;
}

interface IStateProps {
  ethAddress: string;
}

export const DepositEthComponent: React.SFC<IProps & IStateProps> = ({ path, ethAddress }) => {
  return (
    <DepositFunds path={path}>
      <div className={styles.methodEth}>
        <h2 className={styles.title}>
          <FormattedMessage
            id="wallet.deposit-funds.eth.header"
            values={{ icon: <img src={icon} className={styles.icon} alt="ETH icon" /> }}
          />
        </h2>
        <p className={styles.description}>
          <FormattedMessage id="wallet.deposit-funds.eth.email-notification" />
        </p>
        <div className={styles.background}>
          <div className={styles.details}>
            <div className={styles.label}>
              <FormattedMessage id="wallet.deposit-funds.eth.your-eth-address" />
            </div>
            <div className={styles.ethAddress}>{ethAddress}</div>
          </div>
        </div>
      </div>
    </DepositFunds>
  );
};

export const DepositEth = compose(
  appConnect<IStateProps>({
    stateToProps: state => ({
      ethAddress: selectEthereumAddressWithChecksum(state),
    }),
  }),
)(DepositEthComponent);
