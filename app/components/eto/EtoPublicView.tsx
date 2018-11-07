import * as React from "react";
import { branch, renderComponent } from "recompose";
import { compose } from "redux";

import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { selectUserType } from "../../modules/auth/selectors";
import { selectEtoWithCompanyAndContract } from "../../modules/public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../modules/public-etos/types";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { LayoutBase } from "../layouts/LayoutBase";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoPublicComponent } from "./shared/EtoPublicComponent";

interface IStateProps {
  eto?: TEtoWithCompanyAndContract;
  userType?: EUserType;
}

interface IRouterParams {
  previewCode: string;
}

type TProps = {
  eto: TEtoWithCompanyAndContract;
};

const EtoPublicViewLayout: React.SFC<TProps> = ({ eto }) => (
  <EtoPublicComponent companyData={eto.company} etoData={eto} />
);

export const EtoPublicView = compose<React.SFC<IRouterParams>>(
  appConnect<IStateProps, {}, IRouterParams>({
    stateToProps: (state, props) => ({
      userType: selectUserType(state.auth),
      eto: selectEtoWithCompanyAndContract(state, props.previewCode),
    }),
  }),
  onEnterAction({
    actionCreator: (dispatch, props) => {
      dispatch(actions.publicEtos.loadEtoPreview(props.previewCode));
    },
  }),
  branch<IStateProps>(
    props => props.userType === EUserType.INVESTOR,
    withContainer(LayoutAuthorized),
    withContainer(LayoutBase),
  ),
  branch<IStateProps>(props => !props.eto, renderComponent(LoadingIndicator)),
)(EtoPublicViewLayout);
