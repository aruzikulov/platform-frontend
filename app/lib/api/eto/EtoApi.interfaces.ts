import { DeepPartial } from "../../../types";
import * as YupTS from "../../yup-ts";
import { TEtoDocumentTemplates } from "./EtoFileApi.interfaces";

/** COMPANY ETO RELATED INTERFACES
 *  only deals with "/companies/me"
 */

const EtoFounderType = YupTS.object({
  fullName: YupTS.string(),
  role: YupTS.string(),
  bio: YupTS.string(),
});
export type TEtoFounder = YupTS.TypeOf<typeof EtoFounderType>;

const tagsType = YupTS.string();

const EtoCapitalListType = YupTS.object({
  description: YupTS.string().optional(),
  percent: YupTS.number().optional(),
});

export const EtoCompanyInformationType = YupTS.object({
  brandName: YupTS.string(),
  companyWebsite: YupTS.url(),
  companyOneliner: YupTS.string(),
  companyDescription: YupTS.string(),
  keyQuoteFounder: YupTS.string(),
  keyQuoteInvestor: YupTS.string(),
  categories: YupTS.array(tagsType),
  companyLogo: YupTS.string().optional(),
  companyBanner: YupTS.string().optional(),
});
type TEtoTeamData = YupTS.TypeOf<typeof EtoCompanyInformationType>;

export const EtoPitchType = YupTS.object({
  problemSolved: YupTS.string().optional(),
  productVision: YupTS.string().optional(),
  inspiration: YupTS.string().optional(),
  roadmap: YupTS.string().optional(),
  useOfCapital: YupTS.string().optional(),
  useOfCapitalList: YupTS.array(EtoCapitalListType.optional()).optional(),
  customerGroup: YupTS.string().optional(),
  sellingProposition: YupTS.string().optional(),
  marketingApproach: YupTS.string().optional(),
  companyMission: YupTS.string().optional(),
  targetMarketAndIndustry: YupTS.string().optional(),
  keyBenefitsForInvestors: YupTS.string().optional(),
  keyCompetitors: YupTS.string().optional(),
  marketTraction: YupTS.string().optional(),
  businessModel: YupTS.string().optional(),
});

type TEtoProductVision = YupTS.TypeOf<typeof EtoPitchType>;

export const EtoRiskAssessmentType = YupTS.object({
  riskNotRegulatedBusiness: YupTS.onlyTrue(),
  riskNoThirdPartyDependency: YupTS.onlyTrue(),
  riskNoLoansExist: YupTS.onlyTrue(),
  riskLiquidityDescription: YupTS.string(),
  riskThirdPartyDescription: YupTS.string(),
  riskThirdPartySharesFinancing: YupTS.string(),
  riskBusinessModelDescription: YupTS.string(),
  riskMaxDescription: YupTS.string(),
});

type TEtoRiskAssessment = YupTS.TypeOf<typeof EtoRiskAssessmentType>;

const socialChannelsType = YupTS.array(
  YupTS.object({
    type: YupTS.string().optional(),
    url: YupTS.url().optional(),
  }),
);

export type TSocialChannelsType = YupTS.TypeOf<typeof socialChannelsType>;

export const EtoKeyIndividualType = YupTS.object({
  members: YupTS.array(
    YupTS.object({
      name: YupTS.string(),
      role: YupTS.string().optional(),
      image: YupTS.string().optional(),
      description: YupTS.string().optional(),
      website: YupTS.url().optional(),
      socialChannels: socialChannelsType.optional(),
    }),
  ).optional(),
});

export type TEtoKeyIndividualType = YupTS.TypeOf<typeof EtoKeyIndividualType>;

export const EtoKeyIndividualsType = YupTS.object({
  team: EtoKeyIndividualType,
  advisors: EtoKeyIndividualType.optional(),
  boardMembers: EtoKeyIndividualType.optional(),
  notableInvestors: EtoKeyIndividualType.optional(),
  keyCustomers: EtoKeyIndividualType.optional(),
  partners: EtoKeyIndividualType.optional(),
  keyAlliances: EtoKeyIndividualType.optional(),
});

type TEtoKeyIndividualsType = YupTS.TypeOf<typeof EtoKeyIndividualsType>;

export const EtoLegalInformationType = YupTS.object({
  name: YupTS.string(),
  legalForm: YupTS.string(),
  street: YupTS.string(),
  country: YupTS.string(),
  vatNumber: YupTS.string().optional(),
  registrationNumber: YupTS.string().optional(),
  foundingDate: YupTS.string().optional(),
  numberOfEmployees: YupTS.string().optional(),
  companyStage: YupTS.string(),
  numberOfFounders: YupTS.number(),
  lastFundingSizeEur: YupTS.number().optional(),
  companyShares: YupTS.number(),
  shareholders: YupTS.array(
    YupTS.object({
      fullName: YupTS.string(),
      shares: YupTS.number(),
    }),
  ),
});

type TEtoLegalData = YupTS.TypeOf<typeof EtoLegalInformationType>;

const marketingLinksType = YupTS.array(
  YupTS.object({
    title: YupTS.string().optional(),
    url: YupTS.url().optional(),
  }),
);

const companyNewsType = YupTS.array(
  YupTS.object({
    title: YupTS.string().optional(),
    url: YupTS.url().optional(),
    publication: YupTS.string().optional(),
  }),
);

export const EtoMediaType = YupTS.object({
  companyVideo: YupTS.object({
    title: YupTS.string().optional(), // optional in contrast to swagger, because filled in programmatically.
    url: YupTS.url().optional(),
  }),
  companySlideshare: YupTS.object({
    title: YupTS.string().optional(), // optional in contrast to swagger, because filled in programmatically.
    url: YupTS.url().optional(),
  }),

  socialChannels: socialChannelsType.optional(),
  companyNews: companyNewsType.optional(),
  marketingLinks: marketingLinksType.optional(),
  disableTwitterFeed: YupTS.boolean().optional(),
});

type TEtoMediaData = YupTS.TypeOf<typeof EtoMediaType>;

type TEtoCompanyBase = {
  companyId: string;
};

export type TCompanyEtoData = TEtoCompanyBase &
  TEtoTeamData &
  TEtoLegalData &
  TEtoProductVision &
  TEtoRiskAssessment &
  TEtoKeyIndividualsType &
  TEtoMediaData;

/** ETO SPEC RELATED INTERFACES
 *  only deals with "/etos/me"
 */

export enum EtoState {
  PREVIEW = "preview",
  PENDING = "pending",
  LISTED = "listed",
  PROSPECTUS_APPROVED = "prospectus_approved",
  ON_CHAIN = "on_chain",
}

export enum EtoStateToCamelcase {
  "preview" = "preview",
  "pending" = "pending",
  "listed" = "listed",
  "prospectus_approved" = "prospectusApproved",
  "on_chain" = "onChain",
}
// Since only keys are transformed from snake case to camel case we have to manually map states
// see@ swagger /api/eto-listing/ui/#!/ETO/api_eto_get_me
// see@ swagger api/eto-listing/ui/#!/Documents/api_document_documents_state_info

export const EtoTermsType = YupTS.object({
  discountScheme: YupTS.string().optional(),
  currencies: YupTS.array(YupTS.string()).optional(),
  publicDurationDays: YupTS.number(),
  minTicketEur: YupTS.number(),
  maxTicketEur: YupTS.number().optional(),
  enableTransferOnSuccess: YupTS.boolean(),
  notUnderCrowdfundingRegulations: YupTS.onlyTrue(),
  whitelistDurationDays: YupTS.number(),
  additionalTerms: YupTS.string().optional(),
  signingDurationDays: YupTS.number(),
});

export type TEtoTermsType = YupTS.TypeOf<typeof EtoTermsType>;

export const EtoEquityTokenInfoType = YupTS.object({
  equityTokenName: YupTS.string().optional(),
  equityTokenSymbol: YupTS.string().optional(),
  equityTokenImage: YupTS.string().optional(),
});

export type TEtoEquityTokenInfoType = YupTS.TypeOf<typeof EtoEquityTokenInfoType>;

export const EtoVotingRightsType = YupTS.object({
  nominee: YupTS.string().optional(),
  liquidationPreferenceMultiplier: YupTS.number().optional(),
  generalVotingRule: YupTS.string().optional(),
});

export type TEtoVotingRightsType = YupTS.TypeOf<typeof EtoVotingRightsType>;

export const EtoInvestmentTermsType = YupTS.object({
  equityTokensPerShare: YupTS.number().optional(),
  shareNominalValueEur: YupTS.number().optional(),
  preMoneyValuationEur: YupTS.number().optional(),
  existingCompanyShares: YupTS.number().optional(),
  authorizedCapitalShares: YupTS.number().optional(),
  newSharesToIssue: YupTS.number().optional(),
  minimumNewSharesToIssue: YupTS.number().optional(),
  newSharesToIssueInWhitelist: YupTS.number().optional(),
  whitelistDiscountFraction: YupTS.number().optional(),
});

export type TEtoInvestmentTermsType = YupTS.TypeOf<typeof EtoInvestmentTermsType>;

interface IAdditionalEtoType {
  etoId: string;
  companyId: string;
  previewCode: string;
  state: EtoState;
  isBookbuilding: boolean;
  templates: TEtoDocumentTemplates;
  startDate: string;
  documents: TEtoDocumentTemplates;
  maxPledges: number;
  canEnableBookbuilding: boolean;
}

export type TEtoSpecsData = TEtoTermsType &
  TEtoEquityTokenInfoType &
  TEtoVotingRightsType &
  TEtoInvestmentTermsType &
  IAdditionalEtoType;

/*General Interfaces */
export type TPartialEtoSpecData = DeepPartial<TEtoSpecsData>;
export type TPartialCompanyEtoData = DeepPartial<TCompanyEtoData>;

export type TGeneralEtoData = {
  etoData: TPartialEtoSpecData;
  companyData: TPartialCompanyEtoData;
};

// this is comming from the /etos endpoint for investors dashboard
export type TPublicEtoData = TEtoSpecsData & { company: TCompanyEtoData };

export const GeneralEtoDataType = YupTS.object({
  ...EtoTermsType.shape,
  ...EtoEquityTokenInfoType.shape,
  ...EtoVotingRightsType.shape,
  ...EtoMediaType.shape,
  ...EtoLegalInformationType.shape,
  ...EtoKeyIndividualsType.shape,
  ...EtoPitchType.shape,
  ...EtoCompanyInformationType.shape,
  ...EtoRiskAssessmentType.shape,
});
