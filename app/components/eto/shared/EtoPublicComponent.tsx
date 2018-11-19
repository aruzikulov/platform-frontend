import * as cn from "classnames";
import { some } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { TCompanyEtoData } from "../../../lib/api/eto/EtoApi.interfaces";
import { TEtoWithCompanyAndContract } from "../../../modules/public-etos/types";
import { PersonProfileModal } from "../../modals/PersonProfileModal";
import { Accordion, AccordionElement } from "../../shared/Accordion";
import { ChartDoughnut } from "../../shared/charts/ChartDoughnut";
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
import { Cover } from "../public-view/Cover";
import { DocumentsWidget } from "../public-view/DocumentsWidget";
import { EtoInvestmentTermsWidget } from "../public-view/EtoInvestmentTermsWidget";
import { LegalInformationWidget } from "../public-view/LegalInformationWidget";
import { areThereIndividuals, selectActiveCarouselTab } from "./EtoPublicComponent.utils";

import * as styles from "./EtoPublicComponent.module.scss";

const DEFAULT_PLACEHOLDER = "N/A";

export const CHART_COLORS = ["#50e3c2", "#2fb194", "#4a90e2", "#0b0e11", "#394652", "#c4c5c6"];
export const DEFAULT_CHART_COLOR = "#c4c5c6";

interface IProps {
  companyData: TCompanyEtoData;
  etoData: TEtoWithCompanyAndContract;
}

// TODO: There are lots of castings right now in this file, cause formerly the types of IProps was "any"
// The castings should be resolved when the EtoApi.interface.ts reflects the correct data types from swagger!

// TODO: Refactor to smaller components
export const EtoPublicComponent: React.SFC<IProps> = ({ companyData, etoData }) => {
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

  return (
    <>
      <PersonProfileModal />
      <article data-test-id="eto.public-view">
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

        <EtoOverviewStatus eto={etoData} className="mb-4" />

        <Row>
          <Col className="mb-4">
            <SectionHeader layoutHasDecorator={false} className="mb-4">
              <FormattedMessage id="eto.public-view.eto-timeline" />
            </SectionHeader>
            <Panel>
              <EtoTimeline startOfStates={etoData.contract && etoData.contract.startOfStates} />
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
                  <p className={cn(styles.quote, "mb-4")}>{companyData.keyQuoteInvestor}</p>
                )}
              </Panel>
            )}

            <SectionHeader layoutHasDecorator={false} className="mb-4">
              <FormattedMessage id="eto.public-view.legal-information.title" />
            </SectionHeader>

            <LegalInformationWidget companyData={companyData} />
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

            <EtoInvestmentTermsWidget etoData={etoData} />
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
            {(companyData.inspiration ||
              companyData.companyMission ||
              companyData.customerGroup ||
              companyData.productVision ||
              companyData.problemSolved ||
              companyData.marketTraction ||
              companyData.keyCompetitors ||
              companyData.sellingProposition ||
              companyData.useOfCapitalList ||
              companyData.marketingApproach ||
              companyData.roadmap ||
              companyData.targetMarketAndIndustry ||
              companyData.keyBenefitsForInvestors) && (
              <>
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
                    {companyData.companyMission && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.company-mission" />}
                      >
                        <p>{companyData.companyMission}</p>
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
                    {companyData.sellingProposition && (
                      <AccordionElement
                        title={
                          <FormattedMessage id="eto.form.product-vision.selling-proposition" />
                        }
                      >
                        <p>{companyData.sellingProposition}</p>
                      </AccordionElement>
                    )}
                    {companyData.keyBenefitsForInvestors && (
                      <AccordionElement
                        title={
                          <FormattedMessage id="eto.form.product-vision.key-benefits-for-investors" />
                        }
                      >
                        <p>{companyData.keyBenefitsForInvestors}</p>
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
                    {companyData.marketTraction && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.market-traction" />}
                      >
                        <p>{companyData.marketTraction}</p>
                      </AccordionElement>
                    )}
                    {companyData.roadmap && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.roadmap" />}
                      >
                        <p>{companyData.roadmap}</p>
                      </AccordionElement>
                    )}
                    {companyData.businessModel && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.business-model" />}
                      >
                        <p>{companyData.businessModel}</p>
                      </AccordionElement>
                    )}
                    {companyData.marketingApproach && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.marketing-approach" />}
                      >
                        <p>{companyData.marketingApproach}</p>
                      </AccordionElement>
                    )}
                  </Accordion>
                </Panel>
              </>
            )}
          </Col>
          <Col sm={12} md={4}>
            {companyData.marketingLinks && (
              <>
                <SectionHeader layoutHasDecorator={false} className="mb-4">
                  <FormattedMessage id="eto.form.documents.title" />
                </SectionHeader>

                <DocumentsWidget
                  className="mb-4"
                  companyMarketingLinks={companyData.marketingLinks}
                  etoTemplates={etoData.templates}
                  etoDocuments={etoData.documents}
                  isRetailEto={etoData.allowRetailInvestors}
                />
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
      </article>
    </>
  );
};
