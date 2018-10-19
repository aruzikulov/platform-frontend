import { keyBy } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { selectPublicEtos } from "../../../modules/public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../../modules/public-etos/types";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { EtoOverviewStatus } from "../../eto/overview/EtoOverviewStatus";
import { SectionHeader } from "../../shared/SectionHeader";

interface IStateProps {
  etos: TEtoWithCompanyAndContract[] | undefined;
}

type IProps = IStateProps;

const EtoListComponent: React.SFC<IProps> = ({ etos }) => (
  <>
    <Col xs={12}>
      <SectionHeader>
        <FormattedMessage id="dashboard.eto-opportunities" />
      </SectionHeader>
    </Col>
    {etos &&
      etos.map(eto => (
        <Col xs={12} key={eto.etoId}>
          <div className="mb-3">
            <EtoOverviewStatus
              preMoneyValuationEur={eto.preMoneyValuationEur}
              existingCompanyShares={eto.existingCompanyShares}
              equityTokensPerShare={eto.equityTokensPerShare}
              minimumNewSharesToIssue={eto.minimumNewSharesToIssue}
              contract={eto.contract!}
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
              quote={eto.company.keyQuoteFounder}
              campaigningWidget={{
                investorsLimit: eto.maxPledges || 0,
                maxPledge: eto.maxTicketEur || 0,
                minPledge: eto.minTicketEur || 0,
                isActivated: eto.isBookbuilding || false,
              }}
            />
          </div>
        </Col>
      ))}
  </>
);

export const EtoList = compose<React.ComponentClass>(
  setDisplayName("EtoList"),
  onEnterAction({
    actionCreator: d => {
      d(actions.wallet.loadWalletData());
      d(actions.publicEtos.loadEtos());
    },
  }),
  appConnect<IStateProps>({
    stateToProps: state => ({
      etos: selectPublicEtos(state),
    }),
  }),
)(EtoListComponent);
