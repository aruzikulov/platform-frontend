import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { selectMyAssets, selectMyPendingAssets } from "../../modules/investor-tickets/selectors";
import { selectNeuPriceEur } from "../../modules/shared/tokenPrice/selectors";
import { selectNeuBalance, selectNeuBalanceEuroAmount } from "../../modules/wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { LoadingIndicator } from "../shared/loading-indicator";
import { PortfolioLayout, TPortfolioLayoutProps } from "./PortfolioLayout";

export type TStateProps = Partial<TPortfolioLayoutProps>;

export const Portfolio = compose<TPortfolioLayoutProps, {}>(
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.publicEtos.loadEtos()),
  }),
  appConnect<TStateProps>({
    stateToProps: state => ({
      myAssets: selectMyAssets(state),
      pendingAssets: selectMyPendingAssets(state),
      myNeuBalance: selectNeuBalance(state.wallet),
      myNeuBalanceEuroAmount: selectNeuBalanceEuroAmount(state),
      neuPrice: selectNeuPriceEur(state.tokenPrice),
      walletAddress: selectEthereumAddressWithChecksum(state),
    }),
  }),
  withContainer(LayoutAuthorized),
  branch(
    (props: TStateProps) => !props.myAssets && !props.pendingAssets,
    renderComponent(LoadingIndicator),
  ),
)(PortfolioLayout);
