import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { IEtoDocument } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../modules/actions";
import { TEtoWithCompanyAndContract } from "../../../modules/public-etos/types";
import { appConnect } from "../../../store";
import { Button, EButtonLayout } from "../../shared/buttons";
import { Document } from "../../shared/Document";
import { ECurrencySymbol, EMoneyFormat, Money } from "../../shared/Money";
import { NumberFormat } from "../../shared/NumberFormat";
import { Panel } from "../../shared/Panel";
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
  const computedMinNumberOfTokens = etoData.newSharesToIssue * etoData.equityTokensPerShare;

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
            <div className={styles.entry}>
              <span className={styles.label}>
                <FormattedMessage id="eto.public-view.token-terms.investment-amount" />
              </span>
              <span className={styles.value}>
                <InvestmentAmount
                  newSharesToIssue={etoData.newSharesToIssue}
                  existingCompanyShares={etoData.existingCompanyShares}
                  preMoneyValuationEur={etoData.preMoneyValuationEur}
                  minimumNewSharesToIssue={etoData.minimumNewSharesToIssue}
                />
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
            {etoData.templates.investmentAndShareholderAgreement && (
              <Button
                layout={EButtonLayout.INLINE}
                onClick={() =>
                  downloadDocument(etoData.templates.investmentAndShareholderAgreement)
                }
                className={styles.groupDocumentLink}
              >
                <span className={styles.icon}>
                  <Document extension="pdf" />
                </span>
                <FormattedMessage id="eto.documents.investment-and-shareholder-agreement" />
              </Button>
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
            {!!computedMinNumberOfTokens && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.tokens-to-issue" />
                </span>
                <span className={styles.value}>
                  <NumberFormat value={computedMinNumberOfTokens} />
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
              <Button
                layout={EButtonLayout.INLINE}
                className={styles.groupDocumentLink}
                onClick={() =>
                  downloadDocument(etoData.templates.reservationAndAcquisitionAgreement)
                }
              >
                <span className={styles.icon}>
                  <Document extension="pdf" />
                </span>
                <FormattedMessage id="eto.documents.reservation-and-acquisition-agreement" />
              </Button>
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
              <Button
                layout={EButtonLayout.INLINE}
                onClick={() => downloadDocument(etoData.templates.companyTokenHolderAgreement)}
                className={styles.groupDocumentLink}
              >
                <span className={styles.icon}>
                  <Document extension="pdf" />
                </span>
                <FormattedMessage id="eto.documents.tokenholder-agreement" />
              </Button>
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
