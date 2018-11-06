import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { IEtoDocument } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../modules/actions";
import { TEtoWithCompanyAndContract } from "../../../modules/public-etos/types";
import { appConnect } from "../../../store";
import { TDataTestId, TTranslatedString } from "../../../types";
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

type TEntryExternalProps = {
  label: TTranslatedString;
  value: React.ReactNode;
};

const Entry: React.SFC<TEntryExternalProps & TDataTestId> = ({
  label,
  value,
  "data-test-id": dataTestId,
}) => (
  <div className={styles.entry}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value} data-test-id={dataTestId}>
      {value}
    </span>
  </div>
);

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
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.pre-money-valuation" />}
                value={
                  <Money
                    value={etoData.preMoneyValuationEur}
                    currency="eur"
                    format={EMoneyFormat.FLOAT}
                    currencySymbol={ECurrencySymbol.SYMBOL}
                  />
                }
                data-test-id="eto-public-view-pre-money-valuation"
              />
            )}
            {etoData.existingCompanyShares && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.existing-shares" />}
                value={<NumberFormat value={etoData.existingCompanyShares} />}
                data-test-id="eto-public-view-existing-shares"
              />
            )}
            {etoData.authorizedCapitalShares && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.authorized-capital" />}
                value={<NumberFormat value={etoData.authorizedCapitalShares} />}
                data-test-id="eto-public-view-authorized-capital"
              />
            )}
            <Entry
              label={<FormattedMessage id="eto.public-view.token-terms.new-shares-to-issue" />}
              value={
                <>
                  {etoData.minimumNewSharesToIssue}
                  {" - "}
                  {etoData.newSharesToIssue}
                </>
              }
              data-test-id="eto-public-view-new-shares-to-issue"
            />
            {etoData.newSharesToIssueInWhitelist && (
              <Entry
                label={
                  <FormattedMessage id="eto.public-view.token-terms.new-shares-to-issue-in-whitelist" />
                }
                value={etoData.newSharesToIssueInWhitelist}
                data-test-id="eto-public-view-new-shares-to-issue-in-whitelist"
              />
            )}
            <Entry
              label={<FormattedMessage id="eto.public-view.token-terms.new-share-price" />}
              value={
                <Money
                  value={computedNewSharePrice}
                  currency="eur"
                  format={EMoneyFormat.FLOAT}
                  currencySymbol={ECurrencySymbol.SYMBOL}
                />
              }
              data-test-id="eto-public-view-new-share-price"
            />
            {etoData.whitelistDiscountFraction && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.whitelist-discount" />}
                value={<Percentage>{etoData.whitelistDiscountFraction}</Percentage>}
                data-test-id="eto-public-view-whitelist-discount"
              />
            )}
            <Entry
              label={<FormattedMessage id="eto.public-view.token-terms.investment-amount" />}
              value={
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
              }
              data-test-id="eto-public-view-investment-amount"
            />
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
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.tokens-per-share" />}
                value={<NumberFormat value={etoData.equityTokensPerShare} />}
                data-test-id="eto-public-view-tokens-per-share"
              />
            )}
            {!!(computedNewSharePrice && etoData.equityTokensPerShare) && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.token-price" />}
                value={
                  <Money
                    value={computedNewSharePrice / etoData.equityTokensPerShare}
                    currency="eur"
                    format={EMoneyFormat.FLOAT}
                    currencySymbol={ECurrencySymbol.SYMBOL}
                  />
                }
                data-test-id="eto-public-view-token-price"
              />
            )}
            {!!etoData.minTicketEur && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.ticket-size" />}
                value={
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
                }
                data-test-id="eto-public-view-ticket-size"
              />
            )}
            <Entry
              label={<FormattedMessage id="eto.public-view.token-terms.currencies.label" />}
              value={
                <FormattedMessage
                  id="eto.public-view.token-terms.currencies.value"
                  values={{
                    eth: selectCurrencyCode("eth"),
                    nEur: selectCurrencyCode("eur_token"),
                  }}
                />
              }
              data-test-id="eto-public-view-currencies"
            />
            {!!etoData.whitelistDurationDays && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.pre-eto-duration" />}
                value={
                  <>
                    {" "}
                    {etoData.whitelistDurationDays}{" "}
                    <FormattedMessage id="eto.public-view.token-terms.days" />
                  </>
                }
                data-test-id="eto-public-view-pre-eto-duration"
              />
            )}
            {!!etoData.publicDurationDays && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.public-eto-duration" />}
                value={
                  <>
                    {" "}
                    {etoData.publicDurationDays}{" "}
                    <FormattedMessage id="eto.public-view.token-terms.days" />
                  </>
                }
                data-test-id="eto-public-view-public-eto-duration"
              />
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
            {/* TODO: change to {etoData.nominee} when endpoint is avaliable */}
            {!!etoData.nominee && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.nominee" />}
                value={"Neumini UG"}
                data-test-id="eto-public-view-nominee"
              />
            )}
            {!!etoData.signingDurationDays && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.public-offer-duration" />}
                value={
                  <>
                    {" "}
                    {etoData.signingDurationDays}{" "}
                    <FormattedMessage id="eto.public-view.token-terms.days" />
                  </>
                }
                data-test-id="eto-public-view-public-offer-duration"
              />
            )}
            <Entry
              label={<FormattedMessage id="eto.public-view.token-terms.token-tradability" />}
              value={
                <>
                  {etoData.enableTransferOnSuccess ? (
                    <FormattedMessage id="eto.public-view.token-terms.enabled" />
                  ) : (
                    <FormattedMessage id="eto.public-view.token-terms.disabled" />
                  )}
                </>
              }
              data-test-id="eto-public-view-token-tradability"
            />

            <Entry
              label={<FormattedMessage id="eto.public-view.token-terms.voting-rights" />}
              value={
                <>
                  {etoData.generalVotingRule === "no_voting_rights" ||
                  etoData.generalVotingRule === "negative" ? (
                    <FormattedMessage id="eto.public-view.token-terms.no" />
                  ) : (
                    <FormattedMessage id="eto.public-view.token-terms.yes" />
                  )}
                </>
              }
              data-test-id="eto-public-view-voting-rights"
            />

            <Entry
              label={<FormattedMessage id="eto.public-view.token-terms.liquidation-preference" />}
              value={<>{etoData.liquidationPreferenceMultiplier}x</>}
              data-test-id="eto-public-view-liquidation-preference"
            />

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
