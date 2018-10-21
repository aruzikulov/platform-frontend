import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { HeaderProgressStepper } from "../../shared/HeaderProgressStepper";
import { RegisterWalletComponent } from "../light/RegisterLightWallet";
import { WalletMessageSigner } from "../WalletMessageSigner";
import { recoverRoutes } from "./recoverRoutes";
import { WalletLightSeedRecoveryComponent } from "./SeedRecovery";

interface IMainRecoveryState {
  seed?: string;
}

interface IFormValues {
  email: string;
  password: string;
  repeatPassword: string;
  seed?: string;
}

interface IDispatchProps {
  submitForm: (values: IFormValues) => void;
}
interface IMainRecoveryProps {
  submitForm: (values: IFormValues) => void;
  isMessageSigning?: boolean;
}

export class RecoveryProcessesComponent extends React.Component<
  IMainRecoveryProps,
  IMainRecoveryState
> {
  constructor(props: IMainRecoveryProps) {
    super(props);
    this.state = {};
  }

  setSeed = (words: string): void => {
    this.setState({ seed: words });
  };

  render(): React.ReactNode {
    return this.props.isMessageSigning ? (
      <div>
        <WalletMessageSigner rootPath={"/"} />
      </div>
    ) : (
      <div>
        {this.state.seed ? (
          <div>
            <HeaderProgressStepper
              headerText={<FormattedMessage id="wallet-selector.recover.seed.header" />}
              descText={<FormattedMessage id="wallet-selector.recover.seed.register-description" />}
              currentStep={7}
              steps={8}
            />
            <RegisterWalletComponent
              restore={true}
              submitForm={(values: IFormValues) => {
                this.props.submitForm({ ...values, seed: this.state.seed });
              }}
            />
          </div>
        ) : (
          <div>
            <WalletLightSeedRecoveryComponent
              startingStep={0}
              extraSteps={2}
              sendWords={this.setSeed}
            />
          </div>
        )}
        <Col md={12}>
          <Row className="mt-5 pt-5 justify-content-end align-items-center">
            <Link to={recoverRoutes.help}>
              <FormattedMessage id="wallet-selector.recover.help.contact-for-help" />{" "}
              <i className="fa fa-lg fa-angle-right ml-1" />
            </Link>
          </Row>
        </Col>
      </div>
    );
  }
}

export const RecoveryProcesses: React.SFC<IDispatchProps> = props => {
  return <RecoveryProcessesComponent {...props} />;
};

export const RecoverWallet = compose<React.SFC>(
  appConnect<any, IDispatchProps>({
    stateToProps: s => ({
      isMessageSigning: s.walletSelector.isMessageSigning,
    }),
    dispatchToProps: dispatch => ({
      submitForm: (values: IFormValues) => {
        dispatch(
          actions.walletSelector.lightWalletRecover(values.email, values.password, values.seed!),
        );
      },
    }),
  }),
)(RecoveryProcesses);
