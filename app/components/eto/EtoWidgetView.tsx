import * as React from "react";
import { Col } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { selectEtoWithCompanyAndContract } from "../../modules/public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../modules/public-etos/types";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoOverviewStatus } from "./overview/EtoOverviewStatus";

interface IStateProps {
  eto?: TEtoWithCompanyAndContract;
}

interface IRouterParams {
  previewCode: string;
}

type TProps = {
  eto: TEtoWithCompanyAndContract;
  previewCode: string;
};

const EtoWidgetContext = React.createContext<string | undefined>(undefined);

const EtoWidgetComponent: React.SFC<TProps> = ({ eto }) => (
  <Col xs={12}>
    <div className="mb-3">
      <EtoWidgetContext.Provider value={eto.previewCode}>
        <EtoOverviewStatus eto={eto} />
      </EtoWidgetContext.Provider>
    </div>
  </Col>
);

const EtoWidgetView = compose<TProps, IRouterParams>(
  appConnect<IStateProps, {}, IRouterParams>({
    stateToProps: (state, props) => ({
      eto: selectEtoWithCompanyAndContract(state, props.previewCode),
    }),
  }),
  onEnterAction({
    actionCreator: (dispatch, props) => {
      dispatch(actions.publicEtos.loadEtoPreview(props.previewCode));
    },
  }),
  branch<IStateProps>(props => !props.eto, renderComponent(LoadingIndicator)),
)(EtoWidgetComponent);

export { EtoWidgetView, EtoWidgetContext };
