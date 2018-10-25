import * as React from "react";
import { Col, Row } from "reactstrap";
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
  <LayoutAuthorized>
    <Row>
      <Col xs={12} lg={{ size: 8, offset: 2 }}>
        {isLoading ? <LoadingIndicator /> : <EtoRegistrationPanel />}
      </Col>
    </Row>
  </LayoutAuthorized>
);

export const EtoRegister = compose<React.SFC>(
  onEnterAction({ actionCreator: d => d(actions.etoFlow.loadIssuerEto()) }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      isLoading: s.etoFlow.loading,
    }),
  }),
)(EtoRegisterComponent);
