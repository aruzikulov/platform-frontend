import { keyBy } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { EtoState } from "../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../modules/actions";
import { selectPublicEtos } from "../../../modules/public-etos/selectors";
import { ETOStateOnChain, TEtoWithCompanyAndContract } from "../../../modules/public-etos/types";
import { IWalletState } from "../../../modules/wallet/reducer";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { EtoOverviewStatus } from "../../eto/overview/EtoOverviewStatus";
import { SectionHeader } from "../../shared/SectionHeader";

interface IStateProps {
  etos: TEtoWithCompanyAndContract[] | undefined;
  wallet: IWalletState;
}

type IProps = IStateProps;

const EtoListComponent: React.SFC<IProps> = ({ etos, wallet }) => (
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
              investmentAmount={`€ ${(
                ((eto.preMoneyValuationEur || 1) / (eto.existingCompanyShares || 1)) *
                (eto.newSharesToIssue || 1)
              ).toFixed(4)} - €
              ${(
                ((eto.preMoneyValuationEur || 1) / (eto.existingCompanyShares || 1)) *
                (eto.minimumNewSharesToIssue || 1)
              ).toFixed(4)}`}
              contract={eto.contract}
              timedState={eto.contract ? eto.contract.timedState : ETOStateOnChain.Setup}
              wallet={wallet}
              etoId={eto.etoId}
              smartContractOnchain={eto.state === EtoState.ON_CHAIN}
              prospectusApproved={keyBy(eto.documents, "documentType")["approved_prospectus"]}
              termSheet={keyBy(eto.documents, "documentType")["termsheet_template"]}
              canEnableBookbuilding={eto.canEnableBookbuilding}
              etoStartDate={eto.startDate}
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
                quote: (eto.company && eto.company.keyQuoteFounder) || "",
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
      d(actions.wallet.startLoadingWalletData());
      d(actions.publicEtos.loadEtos());
    },
  }),
  appConnect<IStateProps>({
    stateToProps: state => ({
      etos: selectPublicEtos(state),
      wallet: state.wallet,
    }),
  }),
)(EtoListComponent);
