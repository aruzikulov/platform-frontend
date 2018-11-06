import * as cn from "classnames";
import { keyBy } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { compose } from "recompose";

import { CounterWidget, TagsWidget, TokenSymbolWidget } from ".";
import { EEtoDocumentType } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { selectIsAuthorized } from "../../../../modules/auth/selectors";
import { selectIsActionRequiredSettings } from "../../../../modules/notifications/selectors";
import {
  EETOStateOnChain,
  TEtoWithCompanyAndContract,
} from "../../../../modules/public-etos/types";
import { appConnect } from "../../../../store";
import { CommonHtmlProps } from "../../../../types";
import { withParams } from "../../../../utils/withParams";
import { appRoutes } from "../../../appRoutes";
import { ButtonLink } from "../../../shared/buttons";
import { ETOState } from "../../../shared/ETOState";
import { ECurrencySymbol, EMoneyFormat, Money } from "../../../shared/Money";
import { InvestmentAmount } from "../../shared/InvestmentAmount";
import { CampaigningActivatedWidget } from "./CampaigningWidget";
import { ClaimWidget, RefundWidget } from "./ClaimRefundWidget";
import { InvestmentWidget } from "./InvestmentWidget";
import { IWithIsEligibleToPreEto, withIsEligibleToPreEto } from "./withIsEligibleToPreEto";

import * as styles from "./EtoOverviewStatus.module.scss";
import { RegisterNowWidget } from "./RegisterNowWidget";

interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
}

interface IStatusOfEto {
  previewCode: string;
}

interface IStateProps {
  isAuthorized: boolean;
  settingsUpdateRequired: boolean;
}

const StatusOfEto: React.SFC<IStatusOfEto> = ({ previewCode }) => {
  return (
    <div className={styles.statusOfEto}>
      <span className={styles.title}>
        <FormattedMessage id="shared-component.eto-overview.status-of-eto" />
      </span>
      <ETOState previewCode={previewCode} />
    </div>
  );
};

const PoweredByNeufund = () => {
  return (
    <div className={styles.poweredByNeufund}>
      <div className={styles.powered}>Powered by</div>
      <Link className={styles.neufund} target={"_blank"} to={"https://neufund.org"}>
        NEUFUND
      </Link>
    </div>
  );
};

const EtoStatusManager = ({
  eto,
  isAuthorized,
  isEligibleToPreEto,
  settingsUpdateRequired,
}: IExternalProps & IStateProps & IWithIsEligibleToPreEto) => {
  // It's possible for contract to be undefined if eto is not on chain yet
  const timedState = eto.contract ? eto.contract.timedState : EETOStateOnChain.Setup;

  switch (timedState) {
    case EETOStateOnChain.Setup: {
      if (isAuthorized) {
        const nextState = isEligibleToPreEto ? EETOStateOnChain.Whitelist : EETOStateOnChain.Public;
        const nextStateStartDate = eto.contract ? eto.contract.startOfStates[nextState] : undefined;

        return (
          <CampaigningActivatedWidget
            maxPledge={eto.maxTicketEur}
            minPledge={eto.minTicketEur}
            etoId={eto.etoId}
            investorsLimit={eto.maxPledges}
            nextState={nextState}
            nextStateStartDate={nextStateStartDate}
            isActive={eto.isBookbuilding}
            keyQuoteFounder={eto.company.keyQuoteFounder}
          />
        );
      } else {
        return <RegisterNowWidget />;
      }
    }
    case EETOStateOnChain.Whitelist: {
      if (isEligibleToPreEto) {
        return <InvestmentWidget eto={eto} />;
      } else {
        return (
          <CounterWidget
            endDate={eto.contract!.startOfStates[EETOStateOnChain.Public]!}
            state={EETOStateOnChain.Public}
          />
        );
      }
    }

    case EETOStateOnChain.Public: {
      if (settingsUpdateRequired) {
        return (
          <ButtonLink to={appRoutes.settings}>
            <FormattedMessage id="shared-component.eto-overview.settings-update-required" />
          </ButtonLink>
        );
      } else {
        return <InvestmentWidget eto={eto} />;
      }
    }

    case EETOStateOnChain.Claim:
    case EETOStateOnChain.Signing:
    case EETOStateOnChain.Payout: {
      return (
        <ClaimWidget
          etoId={eto.etoId}
          tokenName={eto.equityTokenName || ""}
          totalInvestors={eto.contract!.totalInvestment.totalInvestors.toNumber()}
          totalEquivEurUlps={eto.contract!.totalInvestment.totalEquivEurUlps}
          timedState={timedState}
        />
      );
    }

    case EETOStateOnChain.Refund: {
      return <RefundWidget etoId={eto.etoId} timedState={timedState} />;
    }

    default:
      throw new Error(`State (${timedState}) is not known. Please provide implementation.`);
  }
};

const EtoOverviewStatusLayout: React.SFC<
  IExternalProps & CommonHtmlProps & IWithIsEligibleToPreEto & IStateProps
> = ({ eto, className, isAuthorized, isEligibleToPreEto, settingsUpdateRequired }) => {
  const smartContractOnChain = !!eto.contract;

  const documentsByType = keyBy(eto.documents, document => document.documentType);

  return (
    <div
      className={cn(styles.etoOverviewStatus, className)}
      data-test-id={`eto-overview-${eto.etoId}`}
    >
      <div className={styles.overviewWrapper}>
        <div className={styles.statusWrapper}>
          <StatusOfEto previewCode={eto.previewCode} />
          <Link to={withParams(appRoutes.etoPublicView, { previewCode: eto.previewCode })}>
            <TokenSymbolWidget
              tokenImage={{
                alt: eto.equityTokenName || "",
                srcSet: { "1x": eto.equityTokenImage || "" },
              }}
              tokenName={eto.equityTokenName}
              tokenSymbol={eto.equityTokenSymbol || ""}
            />
          </Link>

          <PoweredByNeufund />
        </div>

        <div className={styles.divider} />

        <div className={styles.tagsWrapper}>
          <TagsWidget
            etoId={eto.etoId}
            termSheet={documentsByType[EEtoDocumentType.TERMSHEET_TEMPLATE]}
            prospectusApproved={documentsByType[EEtoDocumentType.APPROVED_PROSPECTUS]}
            smartContractOnchain={smartContractOnChain}
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.groupWrapper}>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.pre-money-valuation" />
            </span>
            <span className={styles.value}>
              <Money
                value={eto.preMoneyValuationEur}
                currency="eur"
                format={EMoneyFormat.FLOAT}
                currencySymbol={ECurrencySymbol.SYMBOL}
              />
            </span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.investment-amount" />
            </span>
            <span className={styles.value}>
              <InvestmentAmount
                newSharesToIssue={eto.newSharesToIssue}
                newSharesToIssueInFixedSlots={eto.newSharesToIssueInFixedSlots}
                newSharesToIssueInWhitelist={eto.newSharesToIssueInWhitelist}
                fixedSlotsMaximumDiscountFraction={eto.fixedSlotsMaximumDiscountFraction}
                whitelistDiscountFraction={eto.whitelistDiscountFraction}
                existingCompanyShares={eto.existingCompanyShares}
                preMoneyValuationEur={eto.preMoneyValuationEur}
                minimumNewSharesToIssue={eto.minimumNewSharesToIssue}
              />
            </span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.new-shares-generated" />
            </span>
            <span className={styles.value}>{eto.newSharesToIssue}</span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.equity-token-price" />
            </span>
            <span className={styles.value}>
              €{" "}
              {(
                (eto.preMoneyValuationEur || 0) /
                (eto.existingCompanyShares || 1) /
                (eto.equityTokensPerShare || 1)
              ).toFixed(4)}
            </span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.stageContentWrapper}>
          <EtoStatusManager
            eto={eto}
            isAuthorized={isAuthorized}
            isEligibleToPreEto={isEligibleToPreEto}
            settingsUpdateRequired={settingsUpdateRequired}
          />
        </div>
      </div>
    </div>
  );
};

export const EtoOverviewStatus = compose<
  IExternalProps & CommonHtmlProps & IWithIsEligibleToPreEto & IStateProps,
  IExternalProps & CommonHtmlProps
>(
  appConnect<IStateProps, {}, IExternalProps>({
    stateToProps: state => ({
      isAuthorized: selectIsAuthorized(state.auth),
      settingsUpdateRequired: selectIsActionRequiredSettings(state),
    }),
  }),
  withIsEligibleToPreEto,
)(EtoOverviewStatusLayout);
