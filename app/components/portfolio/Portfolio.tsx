import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { selectMyAssets, selectMyPendingAssets } from "../../modules/investor-tickets/selectors";
import { TETOWithInvestorTicket } from "../../modules/investor-tickets/types";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { PortfolioLayout, TPortfolioLayoutProps } from "./PortfolioLayout";

export type TStateProps = {
  myAssets?: TETOWithInvestorTicket[];
  pendingAssets?: TETOWithInvestorTicket[];
};

export const Portfolio = compose<TPortfolioLayoutProps, {}>(
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.publicEtos.loadEtos()),
  }),
  appConnect<TStateProps>({
    stateToProps: state => ({
      myAssets: selectMyAssets(state),
      pendingAssets: selectMyPendingAssets(state),
    }),
  }),
  withContainer(LayoutAuthorized),
  branch(
    (props: TStateProps) => !props.myAssets && !props.pendingAssets,
    renderComponent(LoadingIndicator),
  ),
)(PortfolioLayout);
