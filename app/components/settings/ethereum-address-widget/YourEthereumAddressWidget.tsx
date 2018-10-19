import * as React from "react";

import { FormattedMessage } from "react-intl-phraseapp";
import { selectEthereumAddressWithChecksum } from "../../../modules/web3/selectors";
import { appConnect } from "../../../store";
import { AccountAddress } from "../../shared/AccountAddress";
import { Panel } from "../../shared/Panel";

import * as styles from "./YourEthereumAddressWidget.module.scss";

interface IStateProps {
  address: string;
}

export const YourEthereumAddressWidgetComponent: React.SFC<IStateProps> = ({ address }) => (
  <Panel
    className="h-100"
    headerText={<FormattedMessage id="your-ethereum-address-widget.header" />}
  >
    <div className={styles.panelBody}>
      <AccountAddress address={address} />
    </div>
  </Panel>
);

export const YourEthereumAddressWidget = appConnect<IStateProps>({
  stateToProps: s => ({
    address: selectEthereumAddressWithChecksum(s.web3),
  }),
})(YourEthereumAddressWidgetComponent);
