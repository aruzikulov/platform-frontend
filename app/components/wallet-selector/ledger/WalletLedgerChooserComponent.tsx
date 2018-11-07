import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ILedgerAccount } from "../../../modules/wallet-selector/ledger-wizard/reducer";
import { LoadingIndicator } from "../../shared/loading-indicator";
import * as styles from "./WalletLedgerChooserComponent.module.scss";
import { WalletLedgerChooserTableAdvanced } from "./WalletLedgerChooserTableAdvanced";
import { WalletLedgerChooserTableSimple } from "./WalletLedgerChooserTableSimple";
import { WalletLedgerDPChooser } from "./WalletLedgerDPChooser";

export interface IWalletLedgerChooserComponent {
  accounts: ILedgerAccount[];
  hasPreviousAddress: boolean;
  loading: boolean;
  advanced: boolean;
}

export interface IWalletLedgerChooserComponentDispatchProps {
  onDerivationPathPrefixChange: (derivationPathprefix: string) => void;
  onDerivationPathPrefixError: () => void;
  handleAddressChosen: (account: ILedgerAccount) => void;
  showPrevAddresses: () => void;
  showNextAddresses: () => void;
  handleAdvanced: () => void;
}

export const WalletLedgerChooserComponent: React.SFC<
  IWalletLedgerChooserComponent & IWalletLedgerChooserComponentDispatchProps
> = ({
  accounts,
  handleAddressChosen,
  hasPreviousAddress,
  showPrevAddresses,
  showNextAddresses,
  loading,
  advanced,
  onDerivationPathPrefixChange,
  onDerivationPathPrefixError,
  handleAdvanced,
}) => (
  <>
    <h1 className="text-center mb-4">
      <FormattedMessage id="wallet-selector.ledger.select-wallet" />
    </h1>
    {advanced && (
      <WalletLedgerDPChooser
        onDerivationPathPrefixChange={onDerivationPathPrefixChange}
        onDerivationPathPrefixError={onDerivationPathPrefixError}
      />
    )}
    {loading ? (
      <LoadingIndicator />
    ) : (
      <>
        {accounts.length > 0 &&
          (advanced ? (
            <WalletLedgerChooserTableAdvanced
              accounts={accounts}
              handleAddressChosen={handleAddressChosen}
              hasPreviousAddress={hasPreviousAddress}
              showPrevAddresses={showPrevAddresses}
              showNextAddresses={showNextAddresses}
            />
          ) : (
            <WalletLedgerChooserTableSimple
              accounts={accounts}
              handleAddressChosen={handleAddressChosen}
            />
          ))}
        {!advanced && (
          <button
            className={styles.advanced}
            onClick={handleAdvanced}
            data-test-id="btn-advanced-simple"
          >
            <FormattedMessage id="wallet-selector.ledger.advanced-options" />
            <i className="fa fa-chevron-down ml-2" aria-hidden="true" />
          </button>
        )}
      </>
    )}
    <div className="mt-5 d-flex flex-row justify-content-between align-items-center">
      {advanced &&
        !loading && (
          <button
            className={styles.back}
            onClick={handleAdvanced}
            data-test-id="btn-advanced-advanced"
          >
            <i className={cn("fa fa-chevron-left mr-2", styles.left)} aria-hidden="true" />
            <FormattedMessage id="form.button.back" />
          </button>
        )}
    </div>
  </>
);
