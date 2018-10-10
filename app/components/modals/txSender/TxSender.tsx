import * as cn from "classnames";
import * as React from "react";
import { Modal } from "reactstrap";

import { ITxData, ITxInitData } from "../../../lib/web3/Web3Manager";
import { actions } from "../../../modules/actions";
import {
  ETransactionErrorType,
  ETxSenderState,
  ETxSenderType,
} from "../../../modules/tx/sender/reducer";
import { selectTxSenderModalOpened } from "../../../modules/tx/sender/selectors";
import { appConnect } from "../../../store";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { ModalComponentBody } from "../ModalComponentBody";
import { AccessWalletContainer } from "../walletAccess/AccessWalletModal";
import { InvestmentSelection } from "./investment-flow/Investment";
import { InvestmentSuccess } from "./investment-flow/Success";
import { InvestmentSummary } from "./investment-flow/Summary";
import { ErrorMessage } from "./shared/ErrorMessage";
import { SigningMessage } from "./shared/SigningMessage";
import { TxPending } from "./shared/TxPending";
import { WatchPendingTxs } from "./shared/WatchPeningTxs";
import { WithdrawSuccess } from "./withdraw-flow/Success";
import { WithdrawSummary } from "./withdraw-flow/Summary";
import { Withdraw } from "./withdraw-flow/Withdraw";

interface IStateProps {
  isOpen: boolean;
  state: ETxSenderState;
  type?: ETxSenderType;
  details?: ITxData;
  blockId?: number;
  txHash?: string;
  error?: ETransactionErrorType;
}

interface IDispatchProps {
  onCancel: () => any;
}

type Props = IStateProps & IDispatchProps;

function isBigModal(props: Props): boolean {
  return props.state === ETxSenderState.INIT && props.type === ETxSenderType.INVEST;
}

const TxSenderModalComponent: React.SFC<Props> = props => {
  const { isOpen, onCancel } = props;

  return (
    <Modal isOpen={isOpen} toggle={onCancel} className={cn({ big: isBigModal(props) })}>
      <ModalComponentBody onClose={onCancel}>{renderBody(props)}</ModalComponentBody>
    </Modal>
  );
};

export interface ITxInitDispatchProps {
  onAccept: (tx: ITxInitData) => any;
}

export interface ITxSummaryStateProps {
  txData: ITxInitData;
  txCost: string;
}

export interface ITxSummaryDispatchProps {
  onAccept: () => any;
}
export type TSummaryComponentProps = ITxSummaryStateProps & ITxSummaryDispatchProps;

const InitComponent: React.SFC<{ type?: ETxSenderType }> = ({ type }) => {
  switch (type) {
    case ETxSenderType.INVEST:
      return <InvestmentSelection />;
    case ETxSenderType.WITHDRAW:
      return <Withdraw />;
    default:
      return <LoadingIndicator />;
  }
};

const SummaryComponent: React.SFC<{ type?: ETxSenderType }> = ({ type }) => {
  switch (type) {
    case ETxSenderType.INVEST:
      return <InvestmentSummary />;
    default:
      return <WithdrawSummary />;
  }
};

const SuccessComponent: React.SFC<{ type?: ETxSenderType; txHash?: string }> = ({
  type,
  txHash,
}) => {
  switch (type) {
    case ETxSenderType.INVEST:
      return <InvestmentSuccess txHash={txHash!} />;
    default:
      return <WithdrawSuccess txHash={txHash!} />;
  }
};

function renderBody({ state, blockId, txHash, type, error }: Props): React.ReactNode {
  switch (state) {
    case ETxSenderState.WATCHING_PENDING_TXS:
      return <WatchPendingTxs />;

    case ETxSenderState.INIT:
      if (!type) {
        throw new Error("Transaction type needs to be set at transaction init state");
      }
      return <InitComponent type={type} />;

    case ETxSenderState.SUMMARY:
      return <SummaryComponent type={type!} />;

    case ETxSenderState.ACCESSING_WALLET:
      return <AccessWalletContainer />;

    case ETxSenderState.SIGNING:
      return <SigningMessage />;

    case ETxSenderState.MINING:
      return <TxPending blockId={blockId!} txHash={txHash!} type={type!} />;

    case ETxSenderState.DONE:
      return <SuccessComponent type={type} txHash={txHash!} />;

    case ETxSenderState.ERROR_SIGN:
      return <ErrorMessage type={error} />;
  }
}

const TxSenderModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    isOpen: selectTxSenderModalOpened(state.txSender),
    state: state.txSender.state,
    type: state.txSender.type,
    txHash: state.txSender.txHash,
    blockId: state.txSender.blockId,
    error: state.txSender.error,
  }),
  dispatchToProps: d => ({
    onCancel: () => d(actions.txSender.txSenderHideModal()),
  }),
})(TxSenderModalComponent);

export { TxSenderModal, TxSenderModalComponent };
