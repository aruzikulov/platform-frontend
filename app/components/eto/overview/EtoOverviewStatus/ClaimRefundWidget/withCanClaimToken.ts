import { compose, withProps } from "recompose";

import { EUserType } from "../../../../../lib/api/users/interfaces";
import { selectUserType } from "../../../../../modules/auth/selectors";
import { selectHasInvestorTicket } from "../../../../../modules/investor-tickets/selectors";
import { EETOStateOnChain } from "../../../../../modules/public-etos/types";
import { appConnect } from "../../../../../store";
import { Omit } from "../../../../../types";

interface IExternalProps {
  etoId: string;
  timedState: EETOStateOnChain;
}

interface IStateProps {
  doesInvestorInvest: boolean;
  userType: EUserType | undefined;
}

interface IWithProps {
  canClaimToken: boolean;
}

export const withCanClaimToken = <T extends IWithProps>(wrapper: React.ComponentType<T>) =>
  compose<T, IExternalProps & Omit<T, IWithProps>>(
    appConnect<IStateProps, {}, IExternalProps>({
      stateToProps: (state, props) => ({
        doesInvestorInvest: selectHasInvestorTicket(state, props.etoId),
        userType: selectUserType(state.auth),
      }),
    }),
    withProps<IWithProps, IExternalProps & IStateProps>(props => ({
      canClaimToken:
        [EETOStateOnChain.Claim, EETOStateOnChain.Refund].includes(props.timedState) &&
        props.userType === EUserType.INVESTOR &&
        props.doesInvestorInvest,
    })),
  )(wrapper);
