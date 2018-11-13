import * as React from "react";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { LayoutAuthorized } from "../../layouts/LayoutAuthorized";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { EtoRegistrationPanel } from "./EtoRegistrationPanel";

interface IStateProps {
  isLoading: boolean;
}

export const EtoRegisterComponent: React.SFC<IStateProps> = ({ isLoading }) => (
  <LayoutAuthorized>{isLoading ? <LoadingIndicator /> : <EtoRegistrationPanel />}</LayoutAuthorized>
);

export const EtoRegister = compose<React.SFC>(
  onEnterAction({ actionCreator: d => d(actions.etoFlow.loadIssuerEto()) }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      isLoading: s.etoFlow.loading,
    }),
  }),
)(EtoRegisterComponent);
