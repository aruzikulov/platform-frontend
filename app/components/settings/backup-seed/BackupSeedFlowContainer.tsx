import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { RouteComponentProps, withRouter } from "react-router";
import { Col, Row } from "reactstrap";

import { LayoutAuthorized } from "../../layouts/LayoutAuthorized";
import { HeaderProgressStepper } from "../../shared/HeaderProgressStepper";
import { Panel } from "../../shared/Panel";
import { BackupSeedDisplay } from "./BackupSeedDisplay";
import { BackupSeedIntro } from "./BackupSeedIntro";
import { BackupSeedVerify } from "./BackupSeedVerify";

enum EBackupStep {
  INTRO = 1,
  FIRST_HALF = 2,
  SECOND_HALF = 3,
  VERIFY = 4,
}

interface IProps {
  seed: string[];
  verifyBackupPhrase: () => void;
  onCancel: () => void;
  backupCodesVerified: boolean;
}

interface IState {
  backupStep: EBackupStep;
}

class BackupSeedFlowContainerLayout extends React.Component<
  IProps & RouteComponentProps<any>,
  IState
> {
  state = {
    backupStep: EBackupStep.INTRO,
  };

  onBack = () => {
    if (this.state.backupStep === EBackupStep.INTRO) {
      this.props.history.goBack();
    } else {
      this.setState(s => ({
        backupStep: s.backupStep - 1,
      }));
    }
  };

  onNext = () => {
    this.setState(s => ({
      backupStep: s.backupStep + 1,
    }));
  };

  renderBackupPage(backupStep: EBackupStep): React.ReactNode {
    const { backupCodesVerified } = this.props;

    switch (backupStep) {
      case EBackupStep.INTRO:
        return <BackupSeedIntro onBack={this.onBack} onNext={this.onNext} />;
      case EBackupStep.FIRST_HALF:
        return (
          <BackupSeedDisplay
            onBack={this.onBack}
            onNext={this.onNext}
            words={this.props.seed}
            pageNo={0}
          />
        );
      case EBackupStep.SECOND_HALF:
        return (
          <BackupSeedDisplay
            onBack={this.onBack}
            onNext={() => (backupCodesVerified ? this.props.onCancel() : this.onNext())}
            words={this.props.seed}
            pageNo={1}
          />
        );
      case EBackupStep.VERIFY:
        return (
          <BackupSeedVerify
            onBack={this.onBack}
            onNext={this.props.verifyBackupPhrase}
            words={this.props.seed}
          />
        );
      default:
        throw new Error("Backup step is unknown");
    }
  }

  render(): React.ReactNode {
    const steps = this.props.backupCodesVerified ? 3 : 4;
    return (
      <LayoutAuthorized>
        <Row>
          <Col md={12} lg={{ size: 10, offset: 1 }} xl={{ size: 8, offset: 2 }}>
            <Panel>
              <HeaderProgressStepper
                steps={steps}
                currentStep={this.state.backupStep}
                headerText={
                  <FormattedMessage id="settings.backup-seed-flow-container.safety-message" />
                }
                descText={
                  <FormattedMessage id="settings.backup-seed-flow-container.follow-instructions" />
                }
                warning
              />
              {this.renderBackupPage(this.state.backupStep)}
            </Panel>
          </Col>
        </Row>
      </LayoutAuthorized>
    );
  }
}

const BackupSeedFlowContainer = withRouter(BackupSeedFlowContainerLayout);

export { BackupSeedFlowContainer };
