import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { TCompanyEtoData } from "../../../lib/api/eto/EtoApi.interfaces";
import { ChartDoughnut } from "../../shared/charts/ChartDoughnut";
import { ECurrencySymbol, EMoneyFormat, Money } from "../../shared/Money";
import { NumberFormat } from "../../shared/NumberFormat";
import { Panel } from "../../shared/Panel";
import { FUNDING_ROUNDS } from "../registration/pages/LegalInformation";
import { CHART_COLORS } from "../shared/EtoPublicComponent";

import * as styles from "./LegalInformationWidget.module.scss";

interface IProps {
  companyData: TCompanyEtoData;
}

const generateShareholders = (
  shareholders: TCompanyEtoData["shareholders"],
  companyShares: number,
) => {
  if (shareholders === undefined) {
    return [];
  } else {
    const assignedShares = shareholders.reduce((acc, shareholder) => {
      return shareholder ? (acc += shareholder.shares) : acc;
    }, 0);

    if (assignedShares < companyShares) {
      return [
        ...shareholders,
        {
          fullName: "Others",
          shares: companyShares - assignedShares,
        },
      ];
    }
    return shareholders;
  }
};

export const LegalInformationWidget: React.SFC<IProps> = ({ companyData }) => {
  const shareholdersData = generateShareholders(
    companyData.shareholders,
    companyData.companyShares,
  );

  return (
    <Panel className={styles.legalInformation}>
      <Row>
        <Col>
          <div className={styles.group}>
            {companyData.name && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.legal-company-name" />
                </span>
                <span className={styles.value}>{companyData.name}</span>
              </div>
            )}
            {companyData.name && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.legal-form" />
                </span>
                <span className={styles.value}>{companyData.legalForm}</span>
              </div>
            )}
            {companyData.foundingDate && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.incorporation-date" />
                </span>
                <span className={styles.value}>{companyData.foundingDate}</span>
              </div>
            )}
            {companyData.registrationNumber && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.registration-number" />
                </span>
                <span className={styles.value}>{companyData.registrationNumber}</span>
              </div>
            )}
            {companyData.numberOfFounders && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.number-of-founders" />
                </span>
                <span className={styles.value}>
                  <NumberFormat value={companyData.numberOfFounders} />
                </span>
              </div>
            )}
            {companyData.numberOfEmployees && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.number-of-employees" />
                </span>
                <span className={styles.value}>{companyData.numberOfEmployees}</span>
              </div>
            )}
            {companyData.companyStage && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.last-funding-round" />
                </span>
                <span className={styles.value}>{FUNDING_ROUNDS[companyData.companyStage]}</span>
              </div>
            )}
            {companyData.lastFundingSizeEur && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.last-funding-amount" />
                </span>
                <span className={styles.value}>
                  <Money
                    value={companyData.lastFundingSizeEur}
                    currency="eur"
                    format={EMoneyFormat.FLOAT}
                    currencySymbol={ECurrencySymbol.SYMBOL}
                  />
                </span>
              </div>
            )}
            {companyData.companyShares && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.existing-shares" />
                </span>
                <span className={styles.value}>
                  <NumberFormat value={companyData.companyShares} />
                </span>
              </div>
            )}
          </div>
        </Col>

        <Col>
          <ChartDoughnut
            className="mb-3"
            data={{
              datasets: [
                {
                  data: shareholdersData.map(d => d && d.shares),
                  backgroundColor: shareholdersData.map((_, i: number) => CHART_COLORS[i]),
                },
              ],
              labels: shareholdersData.map(d => d && d.fullName),
            }}
          />
        </Col>
      </Row>
    </Panel>
  );
};
