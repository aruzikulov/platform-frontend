import * as React from "react";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { ledgerWizardFlows } from "../../../modules/wallet-selector/ledger-wizard/flows";
import {
  ILedgerAccount,
  selectHasPreviousPage,
} from "../../../modules/wallet-selector/ledger-wizard/reducer";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { withActionWatcher } from "../../../utils/withActionWatcher";
import {
  IWalletLedgerChooserComponent,
  IWalletLedgerChooserComponentDispatchProps,
  WalletLedgerChooserComponent,
} from "./WalletLedgerChooserComponent";

export const WalletLedgerChooser = compose<React.SFC>(
  appConnect<IWalletLedgerChooserComponent, IWalletLedgerChooserComponentDispatchProps>({
    stateToProps: state => ({
      loading: state.ledgerWizardState.isLoadingAddresses,
      accounts: state.ledgerWizardState.accounts,
      derivationPath: state.ledgerWizardState.derivationPathPrefix,
      hasPreviousAddress: selectHasPreviousPage(state.ledgerWizardState),
      advanced: state.ledgerWizardState.advanced,
    }),
    dispatchToProps: dispatch => ({
      onDerivationPathPrefixError: () =>
        dispatch(actions.walletSelector.ledgerWizardDerivationPathPrefixError()),
      onDerivationPathPrefixChange: (derivationPathPrefix: string) => {
        dispatch(ledgerWizardFlows.setDerivationPathPrefix(derivationPathPrefix));
      },
      handleAddressChosen: (account: ILedgerAccount) => {
        dispatch(ledgerWizardFlows.finishSettingUpLedgerConnector(account.derivationPath));
      },
      showNextAddresses: () => dispatch(ledgerWizardFlows.goToNextPageAndLoadData),
      showPrevAddresses: () => dispatch(ledgerWizardFlows.goToPreviousPageAndLoadData),
      handleAdvanced: () => {
        dispatch(actions.walletSelector.toggleLedgerAccountsAdvanced());
        dispatch(ledgerWizardFlows.loadLedgerAccounts);
      },
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(ledgerWizardFlows.loadLedgerAccounts),
  }),
  withActionWatcher({
    actionCreator: dispatch => dispatch(ledgerWizardFlows.verifyIfLedgerStillConnected),
    interval: 1000,
  }),
)(WalletLedgerChooserComponent);
