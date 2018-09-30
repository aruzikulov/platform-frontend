import * as cn from "classnames";
import { keyBy, some } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { EtoState, TCompanyEtoData } from "../../../lib/api/eto/EtoApi.interfaces";
import { ETOStateOnChain, TEtoWithCompanyAndContract } from "../../../modules/public-etos/types";
import { IWalletState } from "../../../modules/wallet/reducer";
import { PersonProfileModal } from "../../modals/PersonProfileModal";
import { Accordion, AccordionElement } from "../../shared/Accordion";
import { ChartDoughnut } from "../../shared/charts/ChartDoughnut";
import { DocumentsWidget } from "../../shared/DocumentsWidget";
import { InlineIcon } from "../../shared/InlineIcon";
import { ILink, MediaLinksWidget, normalizedUrl } from "../../shared/MediaLinksWidget";
import { Panel } from "../../shared/Panel";
import { IPerson, PeopleSwiperWidget } from "../../shared/PeopleSwiperWidget";
import { SectionHeader } from "../../shared/SectionHeader";
import { Slides } from "../../shared/Slides";
import { IEtoSocialProfile, SocialProfilesList } from "../../shared/SocialProfilesList";
import { TabContent, Tabs } from "../../shared/Tabs";
import { TwitterTimelineEmbed } from "../../shared/TwitterTimeline";
import { Video } from "../../shared/Video";
import { EtoOverviewStatus } from "../overview/EtoOverviewStatus";
import { EtoTimeline } from "../overview/EtoTimeline";
import { Cover } from "../publicView/Cover";
import { EtoInvestmentTermsWidget } from "../publicView/EtoInvestmentTermsWidget";
import { LegalInformationWidget } from "../publicView/LegalInformationWidget";
import { areThereIndividuals, selectActiveCarouselTab } from "./EtoPublicComponent.utils";

import * as icon_link from "../../../assets/img/inline_icons/social_link.svg";
import * as token_icon from "../../../assets/img/token_icon.svg";
import * as styles from "./EtoPublicComponent.module.scss";

const DEFAULT_PLACEHOLDER = "N/A";

export const CHART_COLORS = ["#50e3c2", "#2fb194", "#4a90e2", "#0b0e11", "#394652", "#c4c5c6"];

interface IProps {
  companyData: TCompanyEtoData;
  etoData: TEtoWithCompanyAndContract;
  wallet?: IWalletState | undefined;
}

// TODO: There are lots of castings right now in this file, cause formerly the types of IProps was "any"
// The castings should be resolved when the EtoApi.interface.ts reflects the correct data types from swagger!

// TODO: Refactor to smaller components
export const EtoPublicComponent: React.SFC<IProps> = ({ companyData, etoData, wallet }) => {
  const preMoneyValuationEur = etoData.preMoneyValuationEur || 1;
  const existingCompanyShares = etoData.existingCompanyShares || 1;
  const newSharesToIssue = etoData.newSharesToIssue || 1;
  const equityTokensPerShare = etoData.equityTokensPerShare || 1;
  const minimumNewSharesToIssue = etoData.minimumNewSharesToIssue || 1;

  const computedNewSharePrice = preMoneyValuationEur / existingCompanyShares;
  const computedMinNumberOfTokens = newSharesToIssue * equityTokensPerShare;
  const computedMinCapEur = computedNewSharePrice * newSharesToIssue;
  const computedMaxCapEur = computedNewSharePrice * minimumNewSharesToIssue;

  const { socialChannels, companyVideo, disableTwitterFeed, companySlideshare } = companyData;

  const isTwitterFeedEnabled =
    some(socialChannels, (channel: any) => channel.type === "twitter" && channel.url.length) &&
    !disableTwitterFeed;
  const isYouTubeVideoAvailable = !!(companyVideo && companyVideo.url);
  const isSlideShareAvailable = !!(companySlideshare && companySlideshare.url);
  const hasSocialChannelsAdded = !!(socialChannels && socialChannels.length);
  const twitterUrl =
    isTwitterFeedEnabled && socialChannels
      ? (socialChannels.find(c => c.type === "twitter") as any).url
      : "";

  const marketingLinks = companyData.marketingLinks && {
    documents: companyData.marketingLinks.map(l => ({
      url: l.url || "",
      name: l.title || "",
      icon: <InlineIcon svgIcon={icon_link} />,
    })),
    name: (
      <FormattedMessage
        id="eto.public-view.documents.more-information-about-brand"
        values={{
          brandName: companyData.brandName,
        }}
      />
    ),
  };

  const links = marketingLinks ? [marketingLinks] : [];

  const documentsByType = keyBy(etoData.documents, document => document.documentType);

  return (
    <>
      <PersonProfileModal />
      <div>
        <Cover
          companyName={companyData.brandName}
          companyOneliner={companyData.companyOneliner}
          companyLogo={{
            alt: companyData.brandName,
            srcSet: {
              "1x": companyData.companyLogo as string,
            },
          }}
          companyBanner={{
            alt: companyData.brandName,
            srcSet: {
              "1x": companyData.companyBanner as string,
            },
          }}
          tags={companyData.categories}
        />

        <EtoOverviewStatus
          newSharesToIssue={etoData.newSharesToIssue}
          preMoneyValuationEur={etoData.preMoneyValuationEur}
          existingCompanyShares={etoData.existingCompanyShares}
          equityTokensPerShare={etoData.equityTokensPerShare}
          contract={etoData.contract}
          timedState={etoData.contract ? etoData.contract.timedState : ETOStateOnChain.Setup}
          wallet={wallet}
          etoId={etoData.etoId}
          tokenImage={{
            srcSet: {
              "1x": etoData.equityTokenImage || token_icon,
            },
            alt: `${etoData.equityTokenSymbol} - ${etoData.equityTokenName}`,
          }}
          tokenName={etoData.equityTokenName || ""}
          tokenSymbol={etoData.equityTokenSymbol || ""}
          className="mb-4"
          canEnableBookbuilding={etoData.canEnableBookbuilding}
          investmentAmount={`€ ${(
            ((etoData.preMoneyValuationEur || 1) / (etoData.existingCompanyShares || 1)) *
            (etoData.newSharesToIssue || 1)
          ).toFixed(4)} - €
          ${(
            ((etoData.preMoneyValuationEur || 1) / (etoData.existingCompanyShares || 1)) *
            (etoData.minimumNewSharesToIssue || 1)
          ).toFixed(4)}`}
          newSharesGenerated={etoData.newSharesToIssue}
          smartContractOnchain={etoData.state === EtoState.ON_CHAIN}
          prospectusApproved={documentsByType["approved_prospectus"]}
          termSheet={documentsByType["termsheet_template"]}
          preMoneyValuation={etoData.preMoneyValuationEur}
          etoStartDate={etoData.startDate}
          preEtoDuration={etoData.whitelistDurationDays}
          publicEtoDuration={etoData.publicDurationDays}
          inSigningDuration={etoData.signingDurationDays}
          campaigningWidget={{
            investorsLimit: etoData.maxPledges,
            maxPledge: etoData.maxTicketEur,
            minPledge: etoData.minTicketEur,
            isActivated: etoData.isBookbuilding,
            quote: companyData.keyQuoteFounder,
          }}
        />

        <Row>
          <Col className="mb-4">
            <SectionHeader layoutHasDecorator={false} className="mb-4">
              <FormattedMessage id="eto.public-view.eto-timeline" />
            </SectionHeader>
            <Panel>
              <EtoTimeline
                etoStartDate={etoData.startDate}
                preEtoDuration={etoData.whitelistDurationDays}
                publicEtoDuration={etoData.publicDurationDays}
                inSigningDuration={etoData.signingDurationDays}
              />
            </Panel>
          </Col>
        </Row>

        <Row className="align-items-stretch">
          <Col
            xs={12}
            md={
              isSlideShareAvailable ||
              isTwitterFeedEnabled ||
              isYouTubeVideoAvailable ||
              hasSocialChannelsAdded
                ? 8
                : 12
            }
            className="mb-4"
          >
            <SectionHeader layoutHasDecorator={false} className="mb-4">
              <div className={styles.companyHeader}>
                <div>{companyData.brandName}</div>
                {companyData.companyWebsite && (
                  <a href={normalizedUrl(companyData.companyWebsite)} target="_blank">
                    {companyData.companyWebsite.split("//")[1] || DEFAULT_PLACEHOLDER}
                  </a>
                )}
              </div>
            </SectionHeader>

            {(companyData.companyDescription || companyData.keyQuoteInvestor) && (
              <Panel className="mb-4">
                {companyData.companyDescription && (
                  <p className="mb-4">{companyData.companyDescription}</p>
                )}
                {companyData.keyQuoteInvestor && (
                  <p className={cn(styles.quote, "mb-4")}>"{companyData.keyQuoteInvestor}"</p>
                )}
              </Panel>
            )}

            <SectionHeader layoutHasDecorator={false} className="mb-4">
              <FormattedMessage id="eto.public-view.legal-information.title" />
            </SectionHeader>

            <LegalInformationWidget etoData={etoData} companyData={companyData} />
          </Col>
          {(isYouTubeVideoAvailable || isSlideShareAvailable) && (
            <Col xs={12} md={4} className="mb-4 flex-column d-flex">
              <Tabs className="mb-4" layoutSize="large" layoutOrnament={false}>
                {isYouTubeVideoAvailable && (
                  <TabContent tab="video">
                    <Video
                      youTubeUrl={companyData.companyVideo && companyData.companyVideo.url}
                      hasModal
                    />
                  </TabContent>
                )}
                {isSlideShareAvailable && (
                  <TabContent tab="pitch deck">
                    <Slides
                      slideShareUrl={
                        companyData.companySlideshare && companyData.companySlideshare.url
                      }
                    />
                  </TabContent>
                )}
              </Tabs>
              <div
                className={cn(
                  (isSlideShareAvailable || isTwitterFeedEnabled || isYouTubeVideoAvailable) &&
                    "mt-4",
                )}
              >
                <SocialProfilesList
                  profiles={(companyData.socialChannels as IEtoSocialProfile[]) || []}
                />
              </div>
              {isTwitterFeedEnabled && (
                <>
                  <SectionHeader layoutHasDecorator={false} className="mt-4 mb-4">
                    Twitter
                  </SectionHeader>
                  <Panel
                    narrow
                    className={cn(styles.twitterPanel, "align-self-stretch", "flex-grow-1")}
                  >
                    <TwitterTimelineEmbed url={twitterUrl} userName={companyData.brandName} />
                  </Panel>
                </>
              )}
            </Col>
          )}
        </Row>

        <Row>
          <Col className="mb-4">
            <SectionHeader layoutHasDecorator={false} className="mb-4">
              <FormattedMessage id="eto.public-view.token-terms.title" />
            </SectionHeader>

            <EtoInvestmentTermsWidget
              etoData={etoData}
              etoFilesData={documentsByType}
              computedMaxCapEur={computedMaxCapEur}
              computedMinCapEur={computedMinCapEur}
              computedMinNumberOfTokens={computedMinNumberOfTokens}
              computedNewSharePrice={computedNewSharePrice}
            />
          </Col>
        </Row>

        {areThereIndividuals(companyData.team) && (
          <Row>
            <Col className="mb-4">
              <SectionHeader layoutHasDecorator={false} className="mb-4">
                <FormattedMessage id="eto.public-view.carousel.team" />
              </SectionHeader>
              <Panel>
                <PeopleSwiperWidget
                  people={(companyData.team && (companyData.team.members as IPerson[])) || []}
                  navigation={{
                    nextEl: "people-swiper-team-next",
                    prevEl: "people-swiper-team-prev",
                  }}
                  layout="vertical"
                />
              </Panel>
            </Col>
          </Row>
        )}

        {(areThereIndividuals(companyData.advisors) ||
          areThereIndividuals(companyData.notableInvestors) ||
          areThereIndividuals(companyData.partners) ||
          areThereIndividuals(companyData.keyCustomers) ||
          areThereIndividuals(companyData.keyAlliances) ||
          areThereIndividuals(companyData.boardMembers)) && (
          <Row>
            <Col className="mb-4">
              <Tabs
                className="mb-4"
                layoutSize="large"
                layoutOrnament={false}
                selectedIndex={selectActiveCarouselTab([
                  companyData.advisors,
                  companyData.notableInvestors,
                  companyData.partners,
                  companyData.keyCustomers,
                  companyData.boardMembers,
                  companyData.keyAlliances,
                ])}
              >
                {areThereIndividuals(companyData.advisors) && (
                  <TabContent tab={<FormattedMessage id="eto.public-view.carousel.tab.advisors" />}>
                    <Panel>
                      <PeopleSwiperWidget
                        people={companyData.advisors.members as IPerson[]}
                        navigation={{
                          nextEl: "people-swiper-advisors-next",
                          prevEl: "people-swiper-advisors-prev",
                        }}
                        layout="vertical"
                      />
                    </Panel>
                  </TabContent>
                )}
                {areThereIndividuals(companyData.notableInvestors) && (
                  <TabContent
                    tab={<FormattedMessage id="eto.public-view.carousel.tab.investors" />}
                  >
                    <Panel>
                      <PeopleSwiperWidget
                        people={companyData.notableInvestors.members as IPerson[]}
                        navigation={{
                          nextEl: "people-swiper-investors-next",
                          prevEl: "people-swiper-investors-prev",
                        }}
                        layout="vertical"
                      />
                    </Panel>
                  </TabContent>
                )}
                {areThereIndividuals(companyData.partners) && (
                  <TabContent tab={<FormattedMessage id="eto.public-view.carousel.tab.partners" />}>
                    <Panel>
                      <PeopleSwiperWidget
                        navigation={{
                          nextEl: "people-swiper-partners-next",
                          prevEl: "people-swiper-partners-prev",
                        }}
                        people={companyData.partners.members as IPerson[]}
                        layout="vertical"
                      />
                    </Panel>
                  </TabContent>
                )}
                {areThereIndividuals(companyData.keyCustomers) && (
                  <TabContent
                    tab={<FormattedMessage id="eto.public-view.carousel.tab.key-customers" />}
                  >
                    <Panel>
                      <PeopleSwiperWidget
                        navigation={{
                          nextEl: "people-swiper-partners-next",
                          prevEl: "people-swiper-partners-prev",
                        }}
                        people={companyData.keyCustomers.members as IPerson[]}
                        layout="vertical"
                      />
                    </Panel>
                  </TabContent>
                )}
                {areThereIndividuals(companyData.boardMembers) && (
                  <TabContent
                    tab={<FormattedMessage id="eto.public-view.carousel.tab.board-members" />}
                  >
                    <Panel>
                      <PeopleSwiperWidget
                        navigation={{
                          nextEl: "people-swiper-board-members-next",
                          prevEl: "people-swiper-board-members-prev",
                        }}
                        people={companyData.boardMembers.members as IPerson[]}
                        layout="vertical"
                      />
                    </Panel>
                  </TabContent>
                )}
                {areThereIndividuals(companyData.keyAlliances) && (
                  <TabContent
                    tab={<FormattedMessage id="eto.public-view.carousel.tab.key-alliances" />}
                  >
                    <Panel>
                      <PeopleSwiperWidget
                        navigation={{
                          nextEl: "people-swiper-board-members-next",
                          prevEl: "people-swiper-board-members-prev",
                        }}
                        people={companyData.keyAlliances.members as IPerson[]}
                        layout="vertical"
                      />
                    </Panel>
                  </TabContent>
                )}
              </Tabs>
            </Col>
          </Row>
        )}

        <Row>
          <Col sm={12} md={8} className="mb-4">
            <SectionHeader layoutHasDecorator={false} className="mb-4">
              <FormattedMessage id="eto.public-view.product-vision.title" />
            </SectionHeader>
            <Panel>
              <Accordion>
                {companyData.inspiration && (
                  <AccordionElement
                    title={<FormattedMessage id="eto.form.product-vision.inspiration" />}
                  >
                    <p>{companyData.inspiration}</p>
                  </AccordionElement>
                )}
                {companyData.productVision && (
                  <AccordionElement
                    title={<FormattedMessage id="eto.form.product-vision.product-vision" />}
                  >
                    <p>{companyData.productVision}</p>
                  </AccordionElement>
                )}
                {companyData.problemSolved && (
                  <AccordionElement
                    title={<FormattedMessage id="eto.form.product-vision.problem-solved" />}
                  >
                    <p>{companyData.problemSolved}</p>
                  </AccordionElement>
                )}
                {companyData.customerGroup && (
                  <AccordionElement
                    title={<FormattedMessage id="eto.form.product-vision.customer-group" />}
                  >
                    <p>{companyData.customerGroup}</p>
                  </AccordionElement>
                )}
                {companyData.sellingProposition && (
                  <AccordionElement
                    title={<FormattedMessage id="eto.form.product-vision.selling-proposition" />}
                  >
                    <p>{companyData.sellingProposition}</p>
                  </AccordionElement>
                )}

                {((companyData.useOfCapitalList &&
                  companyData.useOfCapitalList.some((e: any) => e.percent > 0)) ||
                  companyData.useOfCapital) && (
                  <AccordionElement
                    title={<FormattedMessage id="eto.form.product-vision.use-of-capital" />}
                  >
                    <Row>
                      {companyData.useOfCapital && (
                        <Col>
                          <p>{companyData.useOfCapital}</p>
                        </Col>
                      )}

                      {companyData.useOfCapitalList && (
                        <Col md={12} lg={6}>
                          <ChartDoughnut
                            className="pr-5 pb-4"
                            layout="vertical"
                            data={{
                              datasets: [
                                {
                                  data: companyData.useOfCapitalList.map(
                                    d => d && d.percent,
                                  ) as number[],
                                  backgroundColor: companyData.useOfCapitalList.map(
                                    (_, i: number) => CHART_COLORS[i],
                                  ),
                                },
                              ],
                              labels: (companyData.useOfCapitalList || []).map(
                                d => d && d.description,
                              ) as string[],
                            }}
                          />
                        </Col>
                      )}
                    </Row>
                  </AccordionElement>
                )}
                {companyData.marketingApproach && (
                  <AccordionElement
                    title={<FormattedMessage id="eto.form.product-vision.marketing-approach" />}
                  >
                    <p>{companyData.marketingApproach}</p>
                  </AccordionElement>
                )}
                {companyData.companyMission && (
                  <AccordionElement
                    title={<FormattedMessage id="eto.form.product-vision.company-mission" />}
                  >
                    <p>{companyData.companyMission}</p>
                  </AccordionElement>
                )}
                {companyData.roadmap && (
                  <AccordionElement
                    title={<FormattedMessage id="eto.form.product-vision.roadmap" />}
                  >
                    <p>{companyData.roadmap}</p>
                  </AccordionElement>
                )}
                {companyData.targetMarketAndIndustry && (
                  <AccordionElement
                    title={<FormattedMessage id="eto.form.product-vision.target-segment" />}
                  >
                    <p>{companyData.targetMarketAndIndustry}</p>
                  </AccordionElement>
                )}
                {companyData.keyCompetitors && (
                  <AccordionElement
                    title={<FormattedMessage id="eto.form.product-vision.key-competitors" />}
                  >
                    <p>{companyData.keyCompetitors}</p>
                  </AccordionElement>
                )}
                {companyData.marketTraction && (
                  <AccordionElement
                    title={<FormattedMessage id="eto.form.product-vision.market-traction" />}
                  >
                    <p>{companyData.marketTraction}</p>
                  </AccordionElement>
                )}
              </Accordion>
            </Panel>
          </Col>
          <Col sm={12} md={4}>
            {links[0] &&
              !!links[0].documents[0].url && (
                <>
                  <SectionHeader layoutHasDecorator={false} className="mb-4">
                    <FormattedMessage id="eto.form.documents.title" />
                  </SectionHeader>

                  <DocumentsWidget className="mb-4" groups={links} />
                </>
              )}

            {companyData.companyNews &&
              !!companyData.companyNews[0].url && (
                <>
                  <SectionHeader layoutHasDecorator={false} className="mb-4">
                    <FormattedMessage id="eto.form.media-links.title" />
                  </SectionHeader>

                  <MediaLinksWidget links={companyData.companyNews.reverse() as ILink[]} />
                </>
              )}
          </Col>
        </Row>
      </div>
    </>
  );
};
