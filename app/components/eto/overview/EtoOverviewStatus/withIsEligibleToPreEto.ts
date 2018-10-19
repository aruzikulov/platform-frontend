import { compose } from "recompose";

import { selectIsWhitelisted } from "../../../../modules/investor-tickets/selectors";
import { selectLockedWalletConnected } from "../../../../modules/wallet/selectors";
import { appConnect } from "../../../../store";
import { Omit } from "../../../../types";

interface IExternalProps {
  etoId: string;
}

export interface IWithIsEligibleToPreEto {
  isEligibleToPreEto: boolean;
}

export const withIsEligibleToPreEto = <T extends IWithIsEligibleToPreEto>(
  wrapper: React.ComponentType<T>,
) =>
  compose<T, IExternalProps & Omit<T, IWithIsEligibleToPreEto>>(
    appConnect<IWithIsEligibleToPreEto, {}, IExternalProps>({
      stateToProps: (state, props) => {
        const wallet = state.wallet;
        const isLockedWalletConnected = !!wallet && selectLockedWalletConnected(wallet);

        const isWhitelisted = selectIsWhitelisted(props.etoId, state);

        return {
          isEligibleToPreEto: isLockedWalletConnected || isWhitelisted,
        };
      },
    }),
  )(wrapper);
