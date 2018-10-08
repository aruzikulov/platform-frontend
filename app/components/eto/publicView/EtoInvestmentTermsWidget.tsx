import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TEtoDocumentTemplates } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { TEtoWithCompanyAndContract } from "../../../modules/public-etos/types";
import { Document } from "../../shared/Document";
import { Panel } from "../../shared/Panel";

import * as styles from "./EtoInvestmentTermsWidget.module.scss";

interface IProps {
  etoData: TEtoWithCompanyAndContract;
  etoFilesData: TEtoDocumentTemplates;
  computedNewSharePrice: number;
  computedMinCapEur: number;
  computedMinNumberOfTokens: number;
  computedMaxCapEur: number;
}

export const EtoInvestmentTermsWidget: React.SFC<IProps> = ({
  etoData,
  etoFilesData,
  computedNewSharePrice,
  computedMinCapEur,
  computedMinNumberOfTokens,
  computedMaxCapEur,
}) => {
  return (
    <Panel className={styles.tokenTerms}>
      <div className={styles.content}>
        <div className={styles.group}>
          <div className={styles.groupTitle}>
            <FormattedMessage id="eto.public-view.token-terms.group-title.equity" />
          </div>
          <div className={styles.groupContent}>
            {etoData.preMoneyValuationEur && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.pre-money-valuation" />
                </span>
                <span className={styles.value}>
                  {"€ "}
                  {etoData.preMoneyValuationEur}
                </span>
              </div>
            )}
            {etoData.existingCompanyShares && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.existing-shares" />
                </span>
                <span className={styles.value}>{etoData.existingCompanyShares}</span>
              </div>
            )}
            <div className={styles.entry}>
              <span className={styles.label}>
                <FormattedMessage id="eto.public-view.token-terms.new-share-price" />
              </span>
              <span className={styles.value}>
                {"€ "}
                {computedNewSharePrice.toFixed(4)}
              </span>
            </div>
            <div className={styles.entry}>
              <span className={styles.label}>
                <FormattedMessage id="eto.public-view.token-terms.investment-amount" />
              </span>
              <span className={styles.value}>
                {"€ "} {computedMaxCapEur.toFixed(4)} - {"€ "}
                {computedMinCapEur.toFixed(4)}
              </span>
            </div>
            {etoData.discountScheme && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.price-discount" />
                </span>
                <span className={styles.value}>{etoData.discountScheme}</span>
              </div>
            )}
            {!!etoFilesData["signed_investment_and_shareholder_agreement"] && (
              <a
                href={`${etoFilesData["signed_investment_and_shareholder_agreement"]}`}
                className={styles.groupDocumentLink}
              >
                <div className={styles.icon}>
                  <Document extension="pdf" />
                </div>
                <FormattedMessage id="eto.documents.investment-and-shareholder-agreement" />
              </a>
            )}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.group}>
          <div className={styles.groupTitle}>
            <FormattedMessage id="eto.public-view.token-terms.group-title.token-sale" />
          </div>
          <div className={styles.groupContent}>
            {!!etoData.equityTokensPerShare && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.tokens-per-share" />
                </span>
                <span className={styles.value}>{etoData.equityTokensPerShare}</span>
              </div>
            )}
            {!!computedMinNumberOfTokens && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.tokens-to-issue" />
                </span>
                <span className={styles.value}>{computedMinNumberOfTokens}</span>
              </div>
            )}
            {!!(computedNewSharePrice && etoData.equityTokensPerShare) && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.token-price" />
                </span>
                <span className={styles.value}>
                  € {(computedNewSharePrice / etoData.equityTokensPerShare).toFixed(4)}
                </span>
              </div>
            )}
            {!!etoData.whitelistDurationDays && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.pre-eto-duration" />
                </span>
                <span className={styles.value}>
                  {etoData.whitelistDurationDays}{" "}
                  <FormattedMessage id="eto.public-view.token-terms.days" />
                </span>
              </div>
            )}
            {!!etoData.publicDurationDays && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.public-eto-duration" />
                </span>
                <span className={styles.value}>
                  {etoData.publicDurationDays}{" "}
                  <FormattedMessage id="eto.public-view.token-terms.days" />
                </span>
              </div>
            )}
            {!!etoFilesData["reservation_and_acquisition_agreement"] && (
              <a
                href={`${etoFilesData["reservation_and_acquisition_agreement"]}`}
                className={styles.groupDocumentLink}
              >
                <div className={styles.icon}>
                  <Document extension="pdf" />
                </div>
                <FormattedMessage id="eto.documents.reservation-and-acquisition-agreement" />
              </a>
            )}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.group}>
          <div className={styles.groupTitle}>
            <FormattedMessage id="eto.public-view.token-terms.group-title.token-holder-rights" />
          </div>
          <div className={styles.groupContent}>
            {!!etoData.nominee && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.nominee" />
                </span>
                {/* TODO: change to {etoData.nominee} when endpoint is avaliable */}
                <span className={styles.value}>Neumini UG</span>
              </div>
            )}
            {!!etoData.signingDurationDays && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.public-offer-duration" />
                </span>
                <span className={styles.value}>
                  {etoData.signingDurationDays}{" "}
                  <FormattedMessage id="eto.public-view.token-terms.days" />
                </span>
              </div>
            )}
            <div className={styles.entry}>
              <span className={styles.label}>
                <FormattedMessage id="eto.public-view.token-terms.token-tradability" />
              </span>
              <span className={styles.value}>
                {etoData.enableTransferOnSuccess ? (
                  <FormattedMessage id="eto.public-view.token-terms.enabled" />
                ) : (
                  <FormattedMessage id="eto.public-view.token-terms.disabled" />
                )}
              </span>
            </div>

            <div className={styles.entry}>
              <span className={styles.label}>
                <FormattedMessage id="eto.public-view.token-terms.voting-rights" />
              </span>
              <span className={styles.value}>
                {etoData.generalVotingRule === "no_voting_rights" || "negative" ? (
                  <FormattedMessage id="eto.public-view.token-terms.no" />
                ) : (
                  <FormattedMessage id="eto.public-view.token-terms.yes" />
                )}
              </span>
            </div>

            {etoData.liquidationPreferenceMultiplier !== undefined && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.liquidation-preferences" />
                </span>
                <span className={styles.value}>{etoData.liquidationPreferenceMultiplier}x</span>
              </div>
            )}
            {!!etoFilesData["company_token_holder_agreement"] && (
              <a
                href={`${etoFilesData["company_token_holder_agreement"]}`}
                className={styles.groupDocumentLink}
              >
                <div className={styles.icon}>
                  <Document extension="pdf" />
                </div>
                <FormattedMessage id="eto.documents.tokenholder-agreement" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
};
