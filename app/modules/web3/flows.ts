import { GetState } from "../../di/setupBindings";
import { symbols } from "../../di/symbols";
import { NotificationCenter } from "../../lib/dependencies/NotificationCenter";
import { IntlWrapper } from "../../lib/intl/IntlWrapper";
import { injectableFn } from "../../middlewares/redux-injectify";
import { AppDispatch } from "../../store";
import { actions } from "../actions";
import { selectWalletType } from "./selectors";
import { EWalletType } from "./types";

export const web3Flows = {
  personalWalletDisconnected: injectableFn(
    (
      dispatch: AppDispatch,
      getState: GetState,
      notificationCenter: NotificationCenter,
      intlWrapper: IntlWrapper,
    ) => {
      dispatch(actions.walletSelector.reset());
      dispatch(actions.walletSelector.ledgerReset());
      dispatch(actions.web3.personalWalletDisconnected());

      const state = getState();

      const disconnectedWalletErrorMessage = () => {
        switch (selectWalletType(state.web3)) {
          case EWalletType.BROWSER:
            return intlWrapper.intl.formatIntlMessage("modules.web3.flows.web3-error.browser");
          case EWalletType.LEDGER:
            return intlWrapper.intl.formatIntlMessage("modules.web3.flows.web3-error.ledger");
          default:
            return;
        }
      };

      const message = disconnectedWalletErrorMessage();

      if (message) {
        notificationCenter.error(message);
      }
    },
    [symbols.appDispatch, symbols.getState, symbols.notificationCenter, symbols.intlWrapper],
  ),
};

// TODO: Change flow to saga
