import { keyBy } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";
import { compose } from "redux";

import { EtoState, TPublicEtoData } from "../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../modules/actions";
import { selectPublicEtoList } from "../../../modules/public-etos/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { EtoOverviewStatus } from "../../eto/overview/EtoOverviewStatus";
import { SectionHeader } from "../../shared/SectionHeader";

interface IStateProps {
  etos: TPublicEtoData[];
}

interface IDispatchProps {
  startInvestmentFlow: (eto: TPublicEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

// TODO: Invest button needs to go to details view later
export const EtoListComponent: React.SFC<IProps> = ({ etos }) => (
  <>
    <Col xs={12}>
      <SectionHeader>
        <FormattedMessage id="dashboard.eto-opportunities" />
      </SectionHeader>
    </Col>
    {etos.map(eto => (
      <Col xs={12} key={eto.etoId}>
        <div className="mb-3">
          {eto.state === EtoState.ON_CHAIN && (
            <EtoOverviewStatus
              etoId={eto.etoId}
              smartContractOnchain={eto.state === EtoState.ON_CHAIN}
              prospectusApproved={
                !!keyBy(eto.documents, "documentType")["approved_prospectus"].name.length
              }
              termSheet={!!keyBy(eto.documents, "documentType")["termsheet_template"].name.length}
              investmentAmount={0} //TODO: connect proper one
              equityTokenPrice={0} //TODO: connect proper one
              raisedAmount={0} //TODO: connect proper one
              timeToClaim={0} //TODO: connect proper one
              numberOfInvestors={0} //TODO: connect proper one
              etoStartDate={eto.startDate}
              preEtoDuration={eto.whitelistDurationDays}
              publicEtoDuration={eto.publicDurationDays}
              inSigningDuration={eto.signingDurationDays}
              preMoneyValuation={eto.preMoneyValuationEur}
              newSharesGenerated={eto.newSharesToIssue}
              tokenImage={{
                alt: eto.equityTokenName || "",
                srcSet: { "1x": eto.equityTokenImage || "" },
              }}
              tokenName={eto.equityTokenName || ""}
              tokenSymbol={eto.equityTokenSymbol || ""}
              status={eto.state}
              campaigningWidget={{
                investorsLimit: eto.maxPledges,
                maxPledge: eto.maxTicketEur,
                minPledge: eto.minTicketEur,
                isActivated: eto.isBookbuilding,
                quote: "", // TODO: connect proper one
              }}
              publicWidget={{
                investorsBacked: 0, // TODO: connect proper one
                tokensGoal: 0, // TODO: connect proper one
                raisedTokens: 0, // TODO: connect proper one
                etoId: eto.etoId,
              }}
            />
          )}
        </div>
      </Col>
    ))}
  </>
);

export const EtoList = compose<React.ComponentClass>(
  onEnterAction({
    actionCreator: d => d(actions.publicEtos.loadEtos()),
  }),
  appConnect({
    stateToProps: state => ({
      etos: selectPublicEtoList(state.publicEtos),
    }),
    dispatchToProps: d => ({
      startInvestmentFlow: (eto: TPublicEtoData) => {
        d(actions.investmentFlow.startInvestment(eto.etoId));
      },
    }),
  }),
)(EtoListComponent);
