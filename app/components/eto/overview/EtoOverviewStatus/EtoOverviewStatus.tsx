import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";

import { CounterWidget, InvestWidget, TagsWidget, TokenSymbolWidget } from ".";
import { IEtoDocument } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { ETOStateOnChain, IEtoContractData } from "../../../../modules/public-etos/types";
import { IWalletState } from "../../../../modules/wallet/reducer";
import { CommonHtmlProps } from "../../../../types";
import { withParams } from "../../../../utils/withParams";
import { appRoutes } from "../../../appRoutes";
import { ETOState } from "../../../shared/ETOState";
import { IResponsiveImage } from "../../../shared/ResponsiveImage";
import { CampaigningWidget, ICampaigningWidget } from "./CampaigningWidget";
import { ClaimWidget, RefundWidget } from "./ClaimRefundWidget";

import * as styles from "./EtoOverviewStatus.module.scss";

interface IProps {
  wallet: IWalletState | undefined;
  contract: IEtoContractData | undefined;
  etoId: string;
  previewCode: string;
  prospectusApproved: IEtoDocument;
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
  tokenImage: IResponsiveImage;
  tokenName: string;
  tokenSymbol: string;
  termSheet: IEtoDocument;
  newSharesToIssue: number | undefined;
}

interface IStatusOfEto {
  previewCode: string;
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

const EtoOverviewStatus: React.SFC<IProps & CommonHtmlProps> = props => {
  const isEligibleToPreEto = !!(
    props.wallet &&
    props.wallet.data &&
    props.wallet.data.etherTokenICBMLockedWallet.LockedBalance !== "0"
  );

  const smartContractOnChain = !!props.contract;

  // It's possible for contract to be undefined if eto is not on chain yet
  const timedState = props.contract ? props.contract.timedState : ETOStateOnChain.Setup;

  return (
    <div className={cn(styles.etoOverviewStatus, props.className)}>
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
          {timedState === ETOStateOnChain.Setup && (
            <CampaigningWidget
              etoId={props.etoId}
              minPledge={props.campaigningWidget.minPledge}
              maxPledge={props.campaigningWidget.maxPledge}
              isActivated={props.campaigningWidget.isActivated}
              quote={props.campaigningWidget.quote}
              investorsLimit={props.campaigningWidget.investorsLimit}
            />
          )}
          {timedState === ETOStateOnChain.Whitelist &&
            !isEligibleToPreEto && (
              <CounterWidget
                endDate={props.contract!.startOfStates[ETOStateOnChain.Public]!}
                stage="ETO"
              />
            )}
          {timedState === ETOStateOnChain.Whitelist &&
            isEligibleToPreEto && (
              <InvestWidget
                raisedTokens={parseInt(
                  `${props.contract!.totalInvestment.totalTokensInt.toString()}`,
                  10,
                )}
                investorsBacked={parseInt(
                  `${props.contract!.totalInvestment.totalInvestors.toString()}`,
                  10,
                )}
                tokensGoal={(props.newSharesToIssue || 1) * (props.equityTokensPerShare || 1)}
                etoId={props.etoId}
              />
            )}
          {timedState === ETOStateOnChain.Public && (
            <InvestWidget
              raisedTokens={parseInt(
                `${props.contract!.totalInvestment.totalTokensInt.toString()}`,
                10,
              )}
              investorsBacked={parseInt(
                `${props.contract!.totalInvestment.totalInvestors.toString()}`,
                10,
              )}
              tokensGoal={(props.newSharesToIssue || 1) * (props.equityTokensPerShare || 1)}
              etoId={props.etoId}
            />
          )}
          {[ETOStateOnChain.Claim, ETOStateOnChain.Signing, ETOStateOnChain.Payout].includes(
            timedState,
          ) && (
            <ClaimWidget
              etoId={props.etoId}
              tokenName={props.tokenName}
              totalInvestors={props.contract!.totalInvestment.totalInvestors.toNumber()}
              totalEquivEurUlps={props.contract!.totalInvestment.totalEquivEurUlps}
              timedState={timedState}
            />
          )}
          {timedState === ETOStateOnChain.Refund && (
            <RefundWidget etoId={props.etoId} timedState={timedState} />
          )}
        </div>
      </div>
    </div>
  );
};

export { EtoOverviewStatus };
