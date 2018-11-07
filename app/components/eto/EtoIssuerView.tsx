import * as React from "react";
import { branch, renderComponent } from "recompose";
import { compose } from "redux";

import { TCompanyEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { IEtoFiles } from "../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../modules/actions";
import { selectEtoDocumentData } from "../../modules/eto-documents/selectors";
import {
  selectIssuerCompany,
  selectIssuerEtoWithCompanyAndContract,
} from "../../modules/eto-flow/selectors";
import { TEtoWithCompanyAndContract } from "../../modules/public-etos/types";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoPublicComponent } from "./shared/EtoPublicComponent";

type TStateProps = {
  companyData?: TCompanyEtoData;
  etoData?: TEtoWithCompanyAndContract;
  etoFilesData: IEtoFiles;
};

export const EtoIssuerView = compose<React.SFC>(
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.etoFlow.loadIssuerEto());
      dispatch(actions.etoDocuments.loadFileDataStart());
    },
  }),
  appConnect<TStateProps>({
    stateToProps: state => ({
      companyData: selectIssuerCompany(state),
      etoData: selectIssuerEtoWithCompanyAndContract(state),
      etoFilesData: selectEtoDocumentData(state.etoDocuments),
    }),
  }),
  withContainer(LayoutAuthorized),
  branch<TStateProps>(
    props => !props.companyData || !props.etoData,
    renderComponent(LoadingIndicator),
  ),
)(EtoPublicComponent);
