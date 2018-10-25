import * as React from "react";
import { Col } from "reactstrap";
import { compose } from "recompose";

import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { selectUserType } from "../../modules/auth/selectors";
import { selectEtoWithCompanyAndContractById } from "../../modules/public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../modules/public-etos/types";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoOverviewStatus } from "./overview/EtoOverviewStatus";

interface IStateProps {
  eto?: TEtoWithCompanyAndContract;
  userType?: EUserType;
}

interface IRouterParams {
  etoId: string;
}

interface IDispatchProps {
  loadEto: () => void;
}

type IProps = IStateProps & IDispatchProps & IRouterParams;

class EtoWidgetComponent extends React.Component<IProps> {
  render(): React.ReactNode {
    const { eto } = this.props;
    if (!eto) {
      return <LoadingIndicator />;
    }

    return (
      <Col xs={12}>
        <div className="mb-3">
          <EtoOverviewStatus eto={eto} />
        </div>
      </Col>
    );
  }
}

export const EtoWidgetView = compose<IProps, IRouterParams>(
  appConnect<IStateProps, IDispatchProps, IRouterParams>({
    stateToProps: (state, props) => ({
      userType: selectUserType(state.auth),
      eto: selectEtoWithCompanyAndContractById(state, props.etoId),
    }),
  }),
  onEnterAction({
    actionCreator: (dispatch, props) => {
      dispatch(actions.publicEtos.loadEto(props.etoId));
    },
  }),
)(EtoWidgetComponent);
