import BigNumber from "bignumber.js";
import * as cn from "classnames";
import { map } from "lodash/fp";
import * as React from "react";
import { FormattedRelative } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

import { Q18 } from "../../config/constants";
import { IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { TETOWithInvestorTicket } from "../../modules/investor-tickets/types";
import { EETOStateOnChain } from "../../modules/public-etos/types";
import { withParams } from "../../utils/withParams";
import { documentTitles } from "../documents/Documents";
import { externalRoutes } from "../externalRoutes";
import { AssetPortfolio } from "../shared/AssetPortfolio";
import { Document } from "../shared/Document";
import { ETOState } from "../shared/ETOState";
import { ECurrencySymbol, EMoneyFormat, Money } from "../shared/Money";
import { NewTable, NewTableRow } from "../shared/NewTable";
import { SectionHeader } from "../shared/SectionHeader";
import { ClaimedDividends } from "../wallet/claimed-dividends/ClaimedDividends";
import { PortfolioAssetAction } from "./PorfolioAssetAction";

import * as neuIcon from "../../assets/img/neu_icon.svg";
import * as styles from "./PortfolioLayout.module.scss";

export type TPortfolioLayoutProps = {
  myAssets: TETOWithInvestorTicket[];
  pendingAssets: TETOWithInvestorTicket[];
  myNeuBalance: string;
  myNeuBalanceEuroAmount: string;
  neuPrice: string;
  walletAddress: string;
};

const getNeuReward = (equityTokenInt: BigNumber, equivEurUlps: BigNumber): string => {
  if (equivEurUlps.isZero()) {
    return "0";
  }

  return Q18.mul(equityTokenInt)
    .div(equivEurUlps)
    .toFixed(4);
};

const transactions: any[] = []; // TODO: Connect source of data

const PortfolioLayout: React.SFC<TPortfolioLayoutProps> = ({
  myAssets,
  pendingAssets,
  myNeuBalance,
  myNeuBalanceEuroAmount,
  neuPrice,
  walletAddress,
}) => (
  <>
    {process.env.NF_ASSETS_PORTFOLIO_COMPONENT_VISIBLE === "1" && (
      <>
        <SectionHeader layoutHasDecorator={false} className="mb-4">
          <FormattedMessage id="portfolio.section.asset-portfolio.title" />
        </SectionHeader>
        <Row>
          <Col className="mb-4">
            <AssetPortfolio
              icon={neuIcon}
              currency="neu"
              currencyTotal="eur"
              largeNumber="1000000000000"
              value="10000000000000"
              theme="light"
              size="large"
              moneyValue="100000000"
              moneyChange={-20}
              tokenValue="1000000"
              tokenChange={20}
            />
          </Col>
        </Row>
      </>
    )}

    <Row>
      <Col className="mb-4 mt-4">
        <ClaimedDividends
          headerText={<FormattedMessage id="portfolio.section.dividends-from-neu.title" />}
          className="h-100"
          totalEurValue="0"
          recentPayouts={transactions}
        />
      </Col>
    </Row>

    <SectionHeader layoutHasDecorator={false} className="mb-4">
      <FormattedMessage id="portfolio.section.reserved-assets.title" />
    </SectionHeader>

    <Row>
      <Col className="mb-4">
        <NewTable
          keepRhythm={true}
          titles={[
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.token" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.balance" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.value-eur" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.price-eur" />,
            <>
              <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.tokenSmall)} />
              <FormattedMessage id="portfolio.section.reserved-assets.table.header.neu-reward" />
            </>,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.eto-status" />,
          ]}
        >
          {pendingAssets.map(
            ({
              equityTokenImage,
              equityTokenName,
              investorTicket,
              contract,
              etoId,
              previewCode,
            }) => {
              const timedState = contract!.timedState;
              const isWhitelistedOrPublic =
                timedState === EETOStateOnChain.Whitelist || timedState === EETOStateOnChain.Public;

              return (
                <NewTableRow key={etoId}>
                  <>
                    <img src={equityTokenImage} alt="" className={cn("mr-2", styles.token)} />
                    <span>{equityTokenName}</span>
                  </>
                  <>{investorTicket.equityTokenInt.toString()}</>
                  <Money
                    value={investorTicket.equivEurUlps.toString()}
                    currency="eur"
                    currencySymbol={ECurrencySymbol.NONE}
                  />
                  <>{getNeuReward(investorTicket.equityTokenInt, investorTicket.equivEurUlps)}</>
                  <Money
                    value={investorTicket.rewardNmkUlps.toString()}
                    currency="neu"
                    currencySymbol={ECurrencySymbol.NONE}
                  />
                  <>
                    {isWhitelistedOrPublic ? (
                      <>
                        Ends{" "}
                        <FormattedRelative
                          value={contract!.startOfStates[EETOStateOnChain.Signing]!}
                        />
                      </>
                    ) : (
                      <ETOState previewCode={previewCode} />
                    )}
                  </>
                  <PortfolioAssetAction state={timedState} etoId={etoId} />
                </NewTableRow>
              );
            },
          )}
        </NewTable>
      </Col>
    </Row>

    <SectionHeader layoutHasDecorator={false} className="mb-4">
      <FormattedMessage id="portfolio.section.your-assets.title" />
    </SectionHeader>

    <Row>
      <Col className="mb-4">
        <NewTable
          keepRhythm={true}
          placeholder={<FormattedMessage id="portfolio.section.your-assets.table.placeholder" />}
          titles={[
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.token" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.balance" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.value-eur" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.price-eur" />,
            <>
              <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.tokenSmall)} />
              <FormattedMessage id="portfolio.section.reserved-assets.table.header.neu-reward" />
            </>,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.documents" />,
          ]}
        >
          {myNeuBalance !== "0" ? (
            <NewTableRow>
              <>
                <img src={neuIcon} alt="" className={cn("mr-2", styles.token)} />
                <span>{"NEU"}</span>
              </>
              <Money value={myNeuBalance} currency="neu" currencySymbol={ECurrencySymbol.NONE} />
              <Money
                value={myNeuBalanceEuroAmount}
                currency="eur"
                currencySymbol={ECurrencySymbol.SYMBOL}
              />
              <Money
                value={neuPrice}
                format={EMoneyFormat.FLOAT}
                currency="eur"
                currencySymbol={ECurrencySymbol.SYMBOL}
              />
              <>{"-"}</>
              <Link
                to={withParams(externalRoutes.commitmentStatus, { walletAddress })}
                target={"_blank"}
              >
                <FormattedMessage id="portfolio.section.your-assets.tokenholder-agreement" />
              </Link>
            </NewTableRow>
          ) : null}

          {myAssets.map(
            ({ equityTokenImage, equityTokenName, investorTicket, etoId, documents }) => {
              return (
                <NewTableRow key={etoId}>
                  <>
                    <img src={equityTokenImage} alt="" className={cn("mr-2", styles.token)} />
                    <span>{equityTokenName}</span>
                  </>
                  <>{investorTicket.equityTokenInt.toString()}</>
                  <Money
                    value={investorTicket.equivEurUlps.toString()}
                    currency="eur"
                    currencySymbol={ECurrencySymbol.NONE}
                  />
                  <>{getNeuReward(investorTicket.equityTokenInt, investorTicket.equivEurUlps)}</>
                  <Money
                    value={investorTicket.rewardNmkUlps.toString()}
                    currency="neu"
                    currencySymbol={ECurrencySymbol.NONE}
                  />
                  <>
                    {map(
                      (document: IEtoDocument) => (
                        <span key={document.ipfsHash} className={styles.documentLink}>
                          <Document extension="pdf" />
                          <a href={document.name} download>
                            {documentTitles[document.documentType]}
                          </a>
                        </span>
                      ),
                      documents,
                    )}
                  </>
                </NewTableRow>
              );
            },
          )}
        </NewTable>
      </Col>
    </Row>
  </>
);

export { PortfolioLayout };
