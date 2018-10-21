import * as React from "react";

import { isSupportingLedger } from "../../../modules/user-agent/reducer";
import { appConnect } from "../../../store";
import { WalletLedgerChooser } from "./WalletLedgerChooser";
import { WalletLedgerInit } from "./WalletLedgerInitComponent";
import { WalletLedgerNotSupported } from "./WalletLedgerNotSupportedComponent";

interface IWalletLedgerStateProps {
  isConnectionEstablished: boolean;
  isSupportingLedger: boolean;
}

export const WalletLedgerComponent: React.SFC<IWalletLedgerStateProps> = ({
  isConnectionEstablished,
  isSupportingLedger,
}) => {
  if (!isSupportingLedger) {
    return <WalletLedgerNotSupported />;
  } else if (isConnectionEstablished) {
    return <WalletLedgerChooser />;
  } else {
    return <WalletLedgerInit />;
  }
};

export const WalletLedger = appConnect<IWalletLedgerStateProps>({
  stateToProps: state => ({
    isConnectionEstablished: state.ledgerWizardState.isConnectionEstablished,
    isSupportingLedger: isSupportingLedger(state.browser),
  }),
})(WalletLedgerComponent);
