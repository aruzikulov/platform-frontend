import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { compose } from "recompose";

import { CounterWidget, InvestWidget, TagsWidget, TokenSymbolWidget } from ".";
import { IEtoDocument } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { selectIsAuthorized } from "../../../../modules/auth/selectors";
import { ETOStateOnChain, IEtoContractData } from "../../../../modules/public-etos/types";
import { appConnect } from "../../../../store";
import { CommonHtmlProps } from "../../../../types";
import { withParams } from "../../../../utils/withParams";
import { appRoutes } from "../../../appRoutes";
import { ETOState } from "../../../shared/ETOState";
import { ECurrencySymbol, EMoneyFormat, Money } from "../../../shared/Money";
import { IResponsiveImage } from "../../../shared/ResponsiveImage";
import { InvestmentAmount } from "../../shared/InvestmentAmount";
import { ICampaigningWidget, LoggedInCampaigning, LoggedOutCampaigning } from "./CampaigningWidget";
import { ClaimWidget, RefundWidget } from "./ClaimRefundWidget";
import { IWithIsEligibleToPreEto, withIsEligibleToPreEto } from "./withIsEligibleToPreEto";

import * as styles from "./EtoOverviewStatus.module.scss";

interface IProps {
  contract: IEtoContractData | undefined;
  etoId: string;
  previewCode: string;
  quote: string | undefined;
  prospectusApproved: IEtoDocument;
  minimumNewSharesToIssue: number | undefined;
  canEnableBookbuilding: boolean;
  preEtoDuration: number | undefined;
  publicEtoDuration: number | undefined;
  inSigningDuration: number | undefined;
  preMoneyValuation: string | number | undefined;
  newSharesGenerated: string | number | undefined;
  campaigningWidget: ICampaigningWidget;
  preMoneyValuationEur: number | undefined;
  existingCompanyShares: number | undefined;
  equityTokensPerShare: number | undefined;
  tokenImage: IResponsiveImage;
  tokenName: string;
  tokenSymbol: string;
  termSheet: IEtoDocument;
  newSharesToIssue: number | undefined;
}

interface IStatusOfEto {
  previewCode: string;
}

interface IStateProps {
  isAuthorized: boolean;
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
      <div className={styles.neufund}>NEUFUND</div>
    </div>
  );
};

const EtoStatusManager = (
  props: IProps & CommonHtmlProps & IWithIsEligibleToPreEto & IStateProps,
) => {
  // It's possible for contract to be undefined if eto is not on chain yet
  const timedState = props.contract ? props.contract.timedState : ETOStateOnChain.Setup;

  switch (timedState) {
    case ETOStateOnChain.Setup: {
      if (props.isAuthorized) {
        if (props.campaigningWidget.isActivated) {
          return (
            <LoggedInCampaigning
              maxPledge={props.campaigningWidget.maxPledge}
              minPledge={props.campaigningWidget.minPledge}
              etoId={props.etoId}
              investorsLimit={props.campaigningWidget.investorsLimit}
            />
          );
        } else if (
          props.contract &&
          props.contract.startOfStates[ETOStateOnChain.Whitelist]! > new Date()
        ) {
          return (
            <CounterWidget
              endDate={
                props.contract.startOfStates[
                  props.isEligibleToPreEto ? ETOStateOnChain.Whitelist : ETOStateOnChain.Public
                ]!
              }
              stage={props.isEligibleToPreEto ? "PRE-ETO" : "ETO"}
            />
          );
        } else {
          return (
            <div data-test-id="eto-overview-status-founders-quote" className={styles.quote}>
              {props.quote}
            </div>
          );
        }
      } else {
        return <LoggedOutCampaigning />;
      }
    }
    case ETOStateOnChain.Whitelist: {
      if (props.isEligibleToPreEto) {
        return (
          <InvestWidget
            raisedTokens={props.contract!.totalInvestment.totalTokensInt.toNumber()}
            investorsBacked={props.contract!.totalInvestment.totalInvestors.toNumber()}
            tokensGoal={(props.newSharesToIssue || 1) * (props.equityTokensPerShare || 1)}
            etoId={props.etoId}
          />
        );
      } else {
        return (
          <CounterWidget
            endDate={props.contract!.startOfStates[ETOStateOnChain.Public]!}
            stage="ETO"
          />
        );
      }
    }

    case ETOStateOnChain.Public: {
      return (
        <InvestWidget
          raisedTokens={props.contract!.totalInvestment.totalTokensInt.toNumber()}
          investorsBacked={props.contract!.totalInvestment.totalInvestors.toNumber()}
          tokensGoal={(props.newSharesToIssue || 1) * (props.equityTokensPerShare || 1)}
          etoId={props.etoId}
        />
      );
    }

    case ETOStateOnChain.Claim:
    case ETOStateOnChain.Signing:
    case ETOStateOnChain.Payout: {
      return (
        <ClaimWidget
          etoId={props.etoId}
          tokenName={props.tokenName}
          totalInvestors={props.contract!.totalInvestment.totalInvestors.toNumber()}
          totalEquivEurUlps={props.contract!.totalInvestment.totalEquivEurUlps}
          timedState={timedState}
        />
      );
    }

    case ETOStateOnChain.Refund: {
      return <RefundWidget etoId={props.etoId} timedState={timedState} />;
    }

    default:
      throw new Error(`State (${timedState}) is not known. Please provide implementation.`);
  }
};

const EtoOverviewStatusLayout: React.SFC<
  IProps & CommonHtmlProps & IWithIsEligibleToPreEto & IStateProps
> = props => {
  const smartContractOnChain = !!props.contract;

  return (
    <div
      className={cn(styles.etoOverviewStatus, props.className)}
      data-test-id={`eto-overview-${props.etoId}`}
    >
      <div className={styles.overviewWrapper}>
        <div className={styles.statusWrapper}>
          <StatusOfEto previewCode={props.previewCode} />
          <Link to={withParams(appRoutes.etoPublicView, { etoId: props.etoId })}>
            <TokenSymbolWidget
              tokenImage={props.tokenImage}
              tokenName={props.tokenName}
              tokenSymbol={props.tokenSymbol}
            />
          </Link>

          <PoweredByNeufund />
        </div>

        <div className={styles.divider} />

        <div className={styles.tagsWrapper}>
          <TagsWidget
            etoId={props.etoId}
            termSheet={props.termSheet}
            prospectusApproved={props.prospectusApproved}
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
                value={props.preMoneyValuation}
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
                newSharesToIssue={props.newSharesToIssue}
                existingCompanyShares={props.existingCompanyShares}
                preMoneyValuationEur={props.preMoneyValuationEur}
                minimumNewSharesToIssue={props.minimumNewSharesToIssue}
              />
            </span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.new-shares-generated" />
            </span>
            <span className={styles.value}>{props.newSharesGenerated}</span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.equity-token-price" />
            </span>
            <span className={styles.value}>
              €{" "}
              {(
                (props.preMoneyValuationEur || 0) /
                (props.existingCompanyShares || 1) /
                (props.equityTokensPerShare || 1)
              ).toFixed(4)}
            </span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.stageContentWrapper}>
          <EtoStatusManager {...props} />
        </div>
      </div>
    </div>
  );
};

export const EtoOverviewStatus = compose<
  IProps & CommonHtmlProps & IWithIsEligibleToPreEto & IStateProps,
  IProps & CommonHtmlProps
>(
  appConnect<IStateProps>({
    stateToProps: state => ({
      isAuthorized: selectIsAuthorized(state.auth),
    }),
  }),
  withIsEligibleToPreEto,
)(EtoOverviewStatusLayout);
