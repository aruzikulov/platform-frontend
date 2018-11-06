import { compose, withHandlers, withProps } from "recompose";

import { actions } from "../../../../../modules/actions";
import { routingActions } from "../../../../../modules/routing/actions";
import { appConnect } from "../../../../../store";
import {
  CampaigningActivatedInvestorApprovedWidgetLayout,
  ICampaigningActivatedInvestorWidgetLayoutProps,
} from "./CampaigningActivatedInvestorApprovedWidgetLayout";

interface IExternalProps {
  maxPledge?: number;
  minPledge: number;
}

interface IDispatchProps {
  showErrorModal: () => void;
}

interface IHandlersProps {
  showMyEmail: (consentToRevealEmail: boolean) => void;
  backNow: (amount: number) => void;
}

export const CampaigningActivatedUnapprovedInvestorWidget = compose<
  ICampaigningActivatedInvestorWidgetLayoutProps,
  IExternalProps
>(
  appConnect<{}, IDispatchProps>({
    dispatchToProps: dispatch => ({
      showErrorModal: () => {
        dispatch(
          // TODO: please translate
          actions.genericModal.showErrorModal(
            "Please update your account before proceeding.",
            "Head to Settings now.",
            "Go to settings",
            routingActions.goToSettings(),
          ),
        );
      },
    }),
  }),
  withHandlers<IDispatchProps, IHandlersProps>({
    showMyEmail: ({ showErrorModal }) => () => {
      showErrorModal();
    },
    backNow: ({ showErrorModal }) => () => {
      showErrorModal();
    },
  }),
  withProps({
    consentToRevealEmail: false,
    pledgedAmount: "",
  }),
)(CampaigningActivatedInvestorApprovedWidgetLayout);
