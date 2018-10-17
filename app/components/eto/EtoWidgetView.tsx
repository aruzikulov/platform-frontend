import { keyBy } from "lodash";
import * as React from "react";
import { Col } from "reactstrap";
import { compose } from "recompose";

import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { selectUserType } from "../../modules/auth/selectors";
import { selectEtoWithCompanyAndContractById } from "../../modules/public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../modules/public-etos/types";
import { IWalletState } from "../../modules/wallet/reducer";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { EtoOverviewStatus } from "./overview/EtoOverviewStatus";

interface IStateProps {
  eto?: TEtoWithCompanyAndContract;
  userType?: EUserType;
  wallet?: IWalletState;
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
    const { eto, wallet } = this.props;
    if (!eto) {
      return <LoadingIndicator/>;
    }

    return (
      <Col xs={12}>
        <div className="mb-3">
          <EtoOverviewStatus
            preMoneyValuationEur={eto.preMoneyValuationEur}
            existingCompanyShares={eto.existingCompanyShares}
            equityTokensPerShare={eto.equityTokensPerShare}
            minimumNewSharesToIssue={eto.minimumNewSharesToIssue}
            contract={eto.contract!}
            wallet={wallet}
            etoId={eto.etoId}
            previewCode={eto.previewCode}
            prospectusApproved={keyBy(eto.documents, "documentType")["approved_prospectus"]}
            termSheet={keyBy(eto.documents, "documentType")["termsheet_template"]}
            canEnableBookbuilding={eto.canEnableBookbuilding}
            preEtoDuration={eto.whitelistDurationDays}
            publicEtoDuration={eto.publicDurationDays}
            inSigningDuration={eto.signingDurationDays}
            preMoneyValuation={eto.preMoneyValuationEur}
            newSharesGenerated={eto.newSharesToIssue}
            newSharesToIssue={eto.newSharesToIssue}
            tokenImage={{
              alt: eto.equityTokenName || "",
              srcSet: { "1x": eto.equityTokenImage || "" },
            }}
            tokenName={eto.equityTokenName || ""}
            tokenSymbol={eto.equityTokenSymbol || ""}
            campaigningWidget={{
              investorsLimit: eto.maxPledges || 0,
              maxPledge: eto.maxTicketEur || 0,
              minPledge: eto.minTicketEur || 0,
              isActivated: eto.isBookbuilding || false,
              quote: eto.company.keyQuoteFounder,
            }}
          />
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
      wallet: state.wallet,
    }),
  }),
  onEnterAction({
    actionCreator: (dispatch, props) => {
      dispatch(actions.publicEtos.loadEto(props.etoId));
      dispatch(actions.wallet.loadWalletData());
    },
  })
)(EtoWidgetComponent);
