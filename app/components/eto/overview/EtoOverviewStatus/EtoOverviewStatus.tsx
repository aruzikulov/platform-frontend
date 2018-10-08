import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";

import {
  ClaimWidget,
  CounterWidget,
  InvestWidget,
  RefundWidget,
  TagsWidget,
  TokenSymbolWidget,
} from ".";
import { IEtoDocument } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { ETOStateOnChain } from "../../../../modules/public-etos/types";
import { IWalletState } from "../../../../modules/wallet/reducer";
import { CommonHtmlProps } from "../../../../types";
import { withParams } from "../../../../utils/withParams";
import { appRoutes } from "../../../appRoutes";
import { ProjectStatus } from "../../../shared/ProjectStatus";
import { IResponsiveImage } from "../../../shared/ResponsiveImage";
import { CampaigningWidget, ICampaigningWidget } from "./CampaigningWidget";

import * as styles from "./EtoOverviewStatus.module.scss";

interface IProps {
  wallet: IWalletState | undefined;
  contract: any;
  etoId: string;
  prospectusApproved: IEtoDocument;
  etoStartDate: string;
  canEnableBookbuilding: boolean;
  preEtoDuration: number | undefined;
  publicEtoDuration: number | undefined;
  inSigningDuration: number | undefined;
  preMoneyValuation: string | number | undefined;
  investmentAmount: string | number | undefined;
  newSharesGenerated: string | number | undefined;
  campaigningWidget: ICampaigningWidget;
  preMoneyValuationEur: number | undefined;
  existingCompanyShares: number | undefined;
  equityTokensPerShare: number | undefined;
  timedState: number;
  tokenImage: IResponsiveImage;
  tokenName: string;
  tokenSymbol: string;
  smartContractOnchain: boolean;
  termSheet: IEtoDocument;
  newSharesToIssue: number | undefined;
}

interface IStatusOfEto {
  status: number;
}

const StatusOfEto: React.SFC<IStatusOfEto> = ({ status }) => {
  return (
    <div className={styles.statusOfEto}>
      <span className={styles.title}>
        <FormattedMessage id="shared-component.eto-overview.status-of-eto" />
      </span>
      <ProjectStatus status={status} />
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

const EtoOverviewStatus: React.SFC<IProps & CommonHtmlProps> = props => {
  const preEtoStartDate = Date.parse(props.etoStartDate);

  const isEligibleToPreEto = !!(
    props.wallet &&
    props.wallet.data &&
    props.wallet.data.etherTokenICBMLockedWallet.LockedBalance !== "0"
  );

  return (
    <div className={cn(styles.etoOverviewStatus, props.className)}>
      <div className={styles.overviewWrapper}>
        <div className={styles.statusWrapper}>
          <StatusOfEto status={props.timedState} />
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
            smartContractOnchain={props.smartContractOnchain}
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.groupWrapper}>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.pre-money-valuation" />
            </span>
            <span className={styles.value}>
              {"€ "}
              {props.preMoneyValuation}
            </span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.investment-amount" />
            </span>
            <span className={styles.value}>{props.investmentAmount}</span>
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
          {props.timedState === ETOStateOnChain.Setup && (
            <CampaigningWidget
              etoId={props.etoId}
              minPledge={props.campaigningWidget.minPledge}
              maxPledge={props.campaigningWidget.maxPledge}
              isActivated={props.campaigningWidget.isActivated}
              quote={props.campaigningWidget.quote}
              investorsLimit={props.campaigningWidget.investorsLimit}
            />
          )}
          {props.timedState === ETOStateOnChain.Whitelist &&
            !isEligibleToPreEto && <CounterWidget endDate={preEtoStartDate} stage="Pre ETO" />}
          {props.timedState === ETOStateOnChain.Whitelist &&
            isEligibleToPreEto && (
              <InvestWidget
                raisedTokens={parseInt(
                  `${props.contract.totalInvestment.totalTokensInt.toString()}`,
                  10,
                )}
                investorsBacked={parseInt(
                  `${props.contract.totalInvestment.totalInvestors.toString()}`,
                  10,
                )}
                tokensGoal={(props.newSharesToIssue || 1) * (props.equityTokensPerShare || 1)}
                etoId={props.etoId}
              />
            )}
          {props.timedState === ETOStateOnChain.Public && (
            <InvestWidget
              raisedTokens={parseInt(
                `${props.contract.totalInvestment.totalTokensInt.toString()}`,
                10,
              )}
              investorsBacked={parseInt(
                `${props.contract.totalInvestment.totalInvestors.toString()}`,
                10,
              )}
              tokensGoal={(props.newSharesToIssue || 1) * (props.equityTokensPerShare || 1)}
              etoId={props.etoId}
            />
          )}
          {props.timedState === ETOStateOnChain.Claim && (
            <ClaimWidget
              tokenName={props.tokenName}
              totalInvestors={props.contract.totalInvestment.totalInvestors}
              totalEquivEurUlps={props.contract.totalInvestment.totalEquivEurUlps}
              isPayout={false}
            />
          )}
          {props.timedState === ETOStateOnChain.Signing && (
            <ClaimWidget
              tokenName={props.tokenName}
              totalInvestors={props.contract.totalInvestment.totalInvestors}
              totalEquivEurUlps={props.contract.totalInvestment.totalEquivEurUlps}
              isPayout={false}
            />
          )}
          {props.timedState === ETOStateOnChain.Payout && (
            <ClaimWidget
              tokenName={props.tokenName}
              totalInvestors={props.contract.totalInvestment.totalInvestors}
              totalEquivEurUlps={props.contract.totalInvestment.totalEquivEurUlps}
              isPayout={true}
            />
          )}
          {props.timedState === ETOStateOnChain.Refund && <RefundWidget />}
        </div>
      </div>
    </div>
  );
};

export { EtoOverviewStatus };
