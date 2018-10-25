import * as React from "react";
import { compose } from "redux";

import { actions } from "../../modules/actions";
import { selectEtoWithCompanyAndContract } from "../../modules/public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../modules/public-etos/types";
import { appConnect } from "../../store";
import { withContainer } from "../../utils/withContainer";
import { LayoutBase } from "../layouts/LayoutBase";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoPublicComponent } from "./shared/EtoPublicComponent";

interface IStateProps {
  eto?: TEtoWithCompanyAndContract;
}

interface IRouterParams {
  previewCode: string;
}

interface IDispatchProps {
  loadEtoPreview: (previewCode: string) => void;
}

type IProps = IStateProps & IDispatchProps & IRouterParams;

class EtoPreviewComponent extends React.Component<IProps> {
  componentDidMount(): void {
    this.props.loadEtoPreview(this.props.previewCode);
  }

  render(): React.ReactNode {
    if (!this.props.eto) {
      return <LoadingIndicator />;
    }

    return <EtoPublicComponent companyData={this.props.eto.company} etoData={this.props.eto} />;
  }
}

export const EtoPreview = compose<React.SFC<IRouterParams>>(
  appConnect<IStateProps, IDispatchProps, IRouterParams>({
    stateToProps: (state, props) => ({
      eto: selectEtoWithCompanyAndContract(state, props.previewCode),
    }),
    dispatchToProps: dispatch => ({
      loadEtoPreview: (previewCode: string) =>
        dispatch(actions.publicEtos.loadEtoPreview(previewCode)),
    }),
  }),
  withContainer(LayoutBase),
)(EtoPreviewComponent);
