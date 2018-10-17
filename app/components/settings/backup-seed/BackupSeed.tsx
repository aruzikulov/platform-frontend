import * as React from "react";

import { actions } from "../../../modules/actions";
import { selectIsUnlocked, selectSeed } from "../../../modules/web3/selectors";
import { appConnect } from "../../../store";

import { selectBackupCodesVerified } from "../../../modules/auth/selectors";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { BackupSeedFlowContainer } from "./BackupSeedFlowContainer";

interface IDispatchProps {
  verifyBackupPhrase: () => void;
  onCancel: () => void;
  clearSeed: () => void;
  getSeed: () => void;
}

interface IStateProps {
  seed?: string[];
  isUnlocked: boolean;
  backupCodesVerified: boolean;
}

interface IBackupSeedComponentState {
  seed?: string[];
}

class BackupSeedComponent extends React.Component<
  IDispatchProps & IStateProps,
  IBackupSeedComponentState
> {
  constructor(props: IDispatchProps & IStateProps) {
    super(props);
    this.state = {};
  }
  componentWillMount(): void {
    this.props.getSeed();
  }

  componentDidUpdate(): void {
    if (this.props.seed && !this.state.seed) this.setState({ seed: this.props.seed });
  }

  componentWillUnmount(): void {
    this.props.clearSeed();
  }

  render(): React.ReactNode {
    if (this.state.seed)
      return (
        <BackupSeedFlowContainer
          backupCodesVerified={this.props.backupCodesVerified}
          verifyBackupPhrase={this.props.verifyBackupPhrase}
          onCancel={this.props.onCancel}
          seed={this.state.seed}
        />
      );
    return <LoadingIndicator />;
  }
}

export const BackupSeed = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isUnlocked: selectIsUnlocked(s.web3),
    seed: selectSeed(s.web3),
    backupCodesVerified: !!selectBackupCodesVerified(s.auth),
  }),
  dispatchToProps: dispatch => ({
    verifyBackupPhrase: () => dispatch(actions.walletSelector.lightWalletBackedUp()),
    onCancel: () => dispatch(actions.routing.goToSettings()),
    getSeed: () => dispatch(actions.settings.loadSeedOrReturnToSettings()),
    clearSeed: () => dispatch(actions.web3.clearSeedFromState()),
  }),
})(BackupSeedComponent);
