import {
  compose,
  lifecycle,
  StateHandler,
  StateHandlerMap,
  withHandlers,
  withProps,
  withStateHandlers,
} from "recompose";

import { IPledge } from "../../../../../lib/api/eto/EtoPledgeApi.interfaces";
import { actions } from "../../../../../modules/actions";
import { appConnect } from "../../../../../store";
import {
  CampaigningActivatedInvestorApprovedWidgetLayout,
  CampaigningFormState,
  ICampaigningActivatedInvestorWidgetLayoutProps,
} from "./CampaigningActivatedInvestorApprovedWidgetLayout";

export interface IExternalProps {
  etoId: string;
  minPledge: number;
  maxPledge?: number;
  pledge?: IPledge;
}

interface IDispatchProps {
  savePledge: (newPledge: IPledge) => void;
  deletePledge: () => void;
}

interface IHandlersProps {
  showMyEmail: (consentToRevealEmail: boolean) => void;
  backNow: (amount: number) => void;
  changePledge: () => void;
}

interface IWithProps {
  pledgedAmount: number | "";
}

interface ILocalStateProps {
  consentToRevealEmail: boolean;
  formState: CampaigningFormState;
}

type ILocalStateHandlersProps = StateHandlerMap<ILocalStateProps> & {
  changeConsentToRevealEmail: StateHandler<ILocalStateProps>;
  moveToEdit: StateHandler<ILocalStateProps>;
  moveToView: StateHandler<ILocalStateProps>;
};

const CampaigningActivatedInvestorApprovedWidget = compose<
  ICampaigningActivatedInvestorWidgetLayoutProps,
  IExternalProps
>(
  appConnect<{}, IDispatchProps, IExternalProps>({
    dispatchToProps: (dispatch, props) => ({
      savePledge: (newPledge: IPledge) => {
        dispatch(actions.bookBuilding.savePledge(props.etoId, newPledge));
      },
      deletePledge: () => {
        dispatch(actions.bookBuilding.deletePledge(props.etoId));
      },
    }),
  }),
  withStateHandlers<ILocalStateProps, ILocalStateHandlersProps>(
    {
      consentToRevealEmail: false,
      formState: CampaigningFormState.EDIT,
    },
    {
      changeConsentToRevealEmail: () => (consentToRevealEmail: boolean) => ({
        consentToRevealEmail,
      }),
      moveToEdit: () => () => ({ formState: CampaigningFormState.EDIT }),
      moveToView: () => () => ({ formState: CampaigningFormState.VIEW }),
    },
  ),
  lifecycle<ILocalStateHandlersProps & IExternalProps, {}>({
    componentDidUpdate(prevProps): void {
      const pledge = this.props.pledge;

      if (prevProps.pledge !== pledge) {
        if (pledge) {
          this.props.moveToView();
          this.props.changeConsentToRevealEmail(pledge.consentToRevealEmail);
        } else {
          this.props.moveToEdit();
          this.props.changeConsentToRevealEmail(false);
        }
      }
    },
  }),
  withProps<IWithProps, IExternalProps>(({ pledge }) => ({
    pledgedAmount: pledge ? pledge.amountEur : "",
  })),
  withHandlers<
    IExternalProps &
      IDispatchProps &
      ILocalStateProps &
      ILocalStateHandlersProps &
      ILocalStateProps,
    IHandlersProps
  >({
    showMyEmail: ({ pledge, savePledge, changeConsentToRevealEmail }) => (
      consentToRevealEmail: boolean,
    ) => {
      changeConsentToRevealEmail(consentToRevealEmail);

      // only save when already pledged
      if (pledge) {
        const newPledge: IPledge = { ...pledge, consentToRevealEmail };

        savePledge(newPledge);
      }
    },
    backNow: ({ savePledge, consentToRevealEmail, moveToView }) => (amountEur: number) => {
      const newPledge: IPledge = {
        amountEur,
        consentToRevealEmail,
        currency: "eur_t",
      };

      savePledge(newPledge);
      moveToView();
    },
    changePledge: ({ moveToEdit }) => moveToEdit,
  }),
)(CampaigningActivatedInvestorApprovedWidgetLayout);

export { CampaigningActivatedInvestorApprovedWidget };
