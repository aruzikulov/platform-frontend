import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { CommonHtmlProps } from "../../types";
import { Avatar } from "./Avatar";
import { CopyToClipboard } from "./CopyToClipboard";
import { EtherscanAddressLink } from "./EtherscanLink";

import * as styles from "./AccountAddress.module.scss";

export interface IAccountAddressProps {
  address: string;
  "data-test-id"?: string;
}

const AccountAddress: React.SFC<IAccountAddressProps & CommonHtmlProps> = ({
  address,
  className,
}) => {
  return (
    <div className={cn(styles.accountAddress, className)}>
      <Avatar seed={address} />

      <div className={styles.addressWrapper}>
        <div className={styles.address} data-test-id="account-address.your.ether-address.from-div">
          {address}
        </div>
        <div className={styles.transactionHistory}>
          <FormattedMessage id="shared-components.account-address.transaction-history" />{" "}
          <EtherscanAddressLink address={address} />
        </div>
      </div>

      <CopyToClipboard value={address} />
    </div>
  );
};

export { AccountAddress };
