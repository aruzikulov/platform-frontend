import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { IEtoDocument } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../modules/actions";
import { TEtoWithCompanyAndContract } from "../../../modules/public-etos/types";
import { appConnect } from "../../../store";
import { DocumentTemplateButton } from "../../shared/DocumentLink";
import { ECurrencySymbol, EMoneyFormat, Money, selectCurrencyCode } from "../../shared/Money";
import { NumberFormat } from "../../shared/NumberFormat";
import { Panel } from "../../shared/Panel";
import { Percentage } from "../../shared/Percentage";
import { InvestmentAmount } from "../shared/InvestmentAmount";

import * as styles from "./EtoInvestmentTermsWidget.module.scss";

type TExternalProps = {
  etoData: TEtoWithCompanyAndContract;
};

type TDispatchProps = {
  downloadDocument: (document: IEtoDocument) => void;
};

const EtoInvestmentTermsWidgetLayout: React.SFC<TExternalProps & TDispatchProps> = ({
  etoData,
  downloadDocument,
}) => {
  const computedNewSharePrice = etoData.preMoneyValuationEur / etoData.existingCompanyShares;

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
                  <Money
                    value={etoData.preMoneyValuationEur}
                    currency="eur"
                    format={EMoneyFormat.FLOAT}
                    currencySymbol={ECurrencySymbol.SYMBOL}
                  />
                </span>
              </div>
            )}
            {etoData.existingCompanyShares && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.existing-shares" />
                </span>
                <span className={styles.value}>
                  <NumberFormat value={etoData.existingCompanyShares} />
                </span>
              </div>
            )}
            {etoData.authorizedCapitalShares && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.authorized-capital" />
                </span>
                <span className={styles.value}>
                  <NumberFormat value={etoData.authorizedCapitalShares} />
                </span>
              </div>
            )}
            <div className={styles.entry}>
              <span className={styles.label}>
                <FormattedMessage id="eto.public-view.token-terms.new-shares-to-issue" />
              </span>
              <span className={styles.value}>
                {etoData.minimumNewSharesToIssue}
                {" - "}
                {etoData.newSharesToIssue}
              </span>
            </div>
            {etoData.newSharesToIssueInWhitelist && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.new-shares-to-issue-in-whitelist" />
                </span>
                <span className={styles.value}>{etoData.newSharesToIssueInWhitelist}</span>
              </div>
            )}
            <div className={styles.entry}>
              <span className={styles.label}>
                <FormattedMessage id="eto.public-view.token-terms.new-share-price" />
              </span>
              <span className={styles.value}>
                <Money
                  value={computedNewSharePrice}
                  currency="eur"
                  format={EMoneyFormat.FLOAT}
                  currencySymbol={ECurrencySymbol.SYMBOL}
                />
              </span>
            </div>
            {etoData.whitelistDiscountFraction && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.whitelist-discount" />
                </span>
                <span className={styles.value}>
                  <Percentage>{etoData.whitelistDiscountFraction}</Percentage>
                </span>
              </div>
            )}
            <div className={styles.entry}>
              <span className={styles.label}>
                <FormattedMessage id="eto.public-view.token-terms.investment-amount" />
              </span>
              <span className={styles.value}>
                <InvestmentAmount
                  newSharesToIssue={etoData.newSharesToIssue}
                  newSharesToIssueInFixedSlots={etoData.newSharesToIssueInFixedSlots}
                  newSharesToIssueInWhitelist={etoData.newSharesToIssueInWhitelist}
                  fixedSlotsMaximumDiscountFraction={etoData.fixedSlotsMaximumDiscountFraction}
                  whitelistDiscountFraction={etoData.whitelistDiscountFraction}
                  existingCompanyShares={etoData.existingCompanyShares}
                  preMoneyValuationEur={etoData.preMoneyValuationEur}
                  minimumNewSharesToIssue={etoData.minimumNewSharesToIssue}
                />
              </span>
            </div>
            {etoData.templates.investmentAndShareholderAgreement && (
              <DocumentTemplateButton
                title={<FormattedMessage id="eto.documents.investment-and-shareholder-agreement" />}
                onClick={() =>
                  downloadDocument(etoData.templates.investmentAndShareholderAgreement)
                }
              />
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
                <span className={styles.value}>
                  <NumberFormat value={etoData.equityTokensPerShare} />
                </span>
              </div>
            )}
            {!!(computedNewSharePrice && etoData.equityTokensPerShare) && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.token-price" />
                </span>
                <span className={styles.value}>
                  <Money
                    value={computedNewSharePrice / etoData.equityTokensPerShare}
                    currency="eur"
                    format={EMoneyFormat.FLOAT}
                    currencySymbol={ECurrencySymbol.SYMBOL}
                  />
                </span>
              </div>
            )}
            {!!etoData.minTicketEur && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.ticket-size" />
                </span>
                <span className={styles.value}>
                  <Money
                    currency="eur"
                    currencySymbol={ECurrencySymbol.SYMBOL}
                    value={
                      <>
                        {etoData.minTicketEur}
                        {" - "}
                        {etoData.maxTicketEur ? (
                          etoData.maxTicketEur
                        ) : (
                          <FormattedMessage id="common.number-quantity.unlimited" />
                        )}
                      </>
                    }
                  />
                </span>
              </div>
            )}
            <div className={styles.entry}>
              <span className={styles.label}>
                <FormattedMessage id="eto.public-view.token-terms.currencies.label" />
              </span>
              <span className={styles.value}>
                <FormattedMessage
                  id="eto.public-view.token-terms.currencies.value"
                  values={{
                    eth: selectCurrencyCode("eth"),
                    nEur: selectCurrencyCode("eur_token"),
                  }}
                />
              </span>
            </div>
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
            {!!etoData.templates.reservationAndAcquisitionAgreement && (
              <DocumentTemplateButton
                title={
                  <FormattedMessage id="eto.documents.reservation-and-acquisition-agreement" />
                }
                onClick={() =>
                  downloadDocument(etoData.templates.reservationAndAcquisitionAgreement)
                }
              />
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
                {etoData.generalVotingRule === "no_voting_rights" ||
                etoData.generalVotingRule === "negative" ? (
                  <FormattedMessage id="eto.public-view.token-terms.no" />
                ) : (
                  <FormattedMessage id="eto.public-view.token-terms.yes" />
                )}
              </span>
            </div>

            <div className={styles.entry}>
              <span className={styles.label}>
                <FormattedMessage id="eto.public-view.token-terms.liquidation-preference" />
              </span>
              <span className={styles.value}>{etoData.liquidationPreferenceMultiplier}x</span>
            </div>

            {!!etoData.templates.companyTokenHolderAgreement && (
              <DocumentTemplateButton
                title={<FormattedMessage id="eto.documents.tokenholder-agreement" />}
                onClick={() => downloadDocument(etoData.templates.companyTokenHolderAgreement)}
              />
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
};

const EtoInvestmentTermsWidget = compose<TExternalProps & TDispatchProps, TExternalProps>(
  appConnect<{}, TDispatchProps, TExternalProps>({
    dispatchToProps: dispatch => ({
      downloadDocument: (document: IEtoDocument) =>
        dispatch(actions.publicEtos.downloadPublicEtoDocument(document)),
    }),
  }),
)(EtoInvestmentTermsWidgetLayout);

export { EtoInvestmentTermsWidget, EtoInvestmentTermsWidgetLayout };
