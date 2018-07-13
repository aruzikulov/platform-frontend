import { DeepPartial } from "../../types";
import * as YupTS from "../yup-ts";

/** COMPANY ETO RELATED INTERFACES
 *  only deals with "/companies/me"
 */

const EtoFounderType = YupTS.object({
  fullName: YupTS.string(),
  role: YupTS.string(),
  bio: YupTS.string(),
});
export type TEtoFounder = YupTS.TypeOf<typeof EtoFounderType>;

const tagsType = YupTS.string().optional();

const EtoCapitalListType = YupTS.object({
  description: YupTS.string().optional(),
  percent: YupTS.number().optional(),
});

export const EtoCompanyInformationType = YupTS.object({
  brandName: YupTS.string(),
  companyWebsite: YupTS.string(),
  companyOneliner: YupTS.string(),
  companyDescription: YupTS.string(),
  keyQuoteFounder: YupTS.string(),
  keyQuoteInvestor: YupTS.string(),
  categories: YupTS.array(tagsType),
  companyLogo: YupTS.string().optional(),
  companyBanner: YupTS.string().optional(),
});
type TEtoTeamData = YupTS.TypeOf<typeof EtoCompanyInformationType>;

export const EtoProductVisionType = YupTS.object({
  problemSolved: YupTS.string().optional(),
  productVision: YupTS.string().optional(),
  inspiration: YupTS.string().optional(),
  keyProductPriorities: YupTS.string().optional(),
  useOfCapital: YupTS.string().optional(),
  useOfCapitalList: YupTS.array(EtoCapitalListType.optional()).optional(),
  customerGroup: YupTS.string().optional(),
  sellingProposition: YupTS.string().optional(),
  marketingApproach: YupTS.string().optional(),
  salesModel: YupTS.string().optional(),
});

type TEtoProductVision = YupTS.TypeOf<typeof EtoProductVisionType>;

export const EtoRiskAssesmentType = YupTS.object({
  riskNotRegulatedBusiness: YupTS.onlyTrue(),
  riskNoThirdPartyDependency: YupTS.onlyTrue(),
  riskNoLoansExist: YupTS.onlyTrue(),
  riskLiquidityDescription: YupTS.string(),
  riskThirdPartyDescription: YupTS.string(),
  riskThirdPartySharesFinancing: YupTS.string(),
  riskChangingAgreementDescription: YupTS.string(),
  riskMaxDescription: YupTS.string(),
});

type TEtoRiskAssesment = YupTS.TypeOf<typeof EtoRiskAssesmentType>;

export const EtoKeyIndividualsType = YupTS.object({
  founders: YupTS.object({
    description: YupTS.string(),
    members: YupTS.array(
      YupTS.object({
        name: YupTS.string(),
        role: YupTS.string(),
        description: YupTS.string(),
      }),
    ),
  }),
  boardMembers: YupTS.object({
    description: YupTS.string(),
    members: YupTS.array(
      YupTS.object({
        name: YupTS.string(),
        role: YupTS.string(),
        description: YupTS.string(),
      }),
    ),
  }),
  notableInvestors: YupTS.object({
    description: YupTS.string(),
    members: YupTS.array(
      YupTS.object({
        name: YupTS.string(),
        role: YupTS.string(),
        description: YupTS.string(),
      }),
    ),
  }),
  keyCustomers: YupTS.array(
    YupTS.object({
      name: YupTS.string(),
      role: YupTS.string(),
      description: YupTS.string(),
    }),
  ),
  partners: YupTS.object({
    description: YupTS.string(),
    members: YupTS.array(
      YupTS.object({
        name: YupTS.string(),
        role: YupTS.string(),
        description: YupTS.string(),
      }),
    ),
  }),
  keyAlliances: YupTS.array(
    YupTS.object({
      name: YupTS.string(),
      role: YupTS.string(),
      description: YupTS.string(),
    }),
  ),
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
});
type TEtoLegalData = YupTS.TypeOf<typeof EtoCompanyInformationType>;

export const EtoMediaType = YupTS.object({
  socialChannels: YupTS.array(
    YupTS.object({
      type: YupTS.string().optional(),
      url: YupTS.string().optional(),
    }),
  ).optional(),
  companyNews: YupTS.array(
    YupTS.object({
      title: YupTS.string().optional(),
      url: YupTS.string().optional(),
    }),
  ).optional(),
  disableTwitterFeed: YupTS.boolean().optional(),
});

type TEtoMediaData = YupTS.TypeOf<typeof EtoMediaType>;

export type TCompanyEtoData =
  | TEtoTeamData
  | TEtoLegalData
  | TEtoProductVision
  | TEtoRiskAssesment
  | TEtoKeyIndividualsType
  | TEtoMediaData;

/** ETO SPEC RELATED INTERFACES
 *  only deals with "/etos/me"
 */

export const EtoTermsType = YupTS.object({
  equityTokenName: YupTS.string(),
  equityTokenSymbol: YupTS.string(),
  equityTokenImage: YupTS.string(),
  equityTokensPerShare: YupTS.number(),
  fullyDilutedPreMoneyValuationEur: YupTS.number(),
  existingCompanyShares: YupTS.number(),
  newSharesToIssue: YupTS.number(),
  discountScheme: YupTS.string(),
  shareNominalValueEur: YupTS.number(),
  publicDurationDays: YupTS.number(),
  minTicketEur: YupTS.number(),
  enableTransferOnSuccess: YupTS.boolean(),
  // TODO: This fields moved to Risk Assesment and needs to be disconnected here
  riskRegulatedBusiness: YupTS.boolean(),
  // TODO: This fields moved to Risk Assesment and needs to be disconnected here
  riskThirdParty: YupTS.boolean(),
  liquidationPreferenceMultiplier: YupTS.number(),
  tagAlongVotingRule: YupTS.boolean(),
  whitelistDurationDays: YupTS.number(),
});

type TEtoTermsType = YupTS.TypeOf<typeof EtoTermsType>;

export type TEtoSpecsData = TEtoTermsType;

/*General Interfaces */
export type TPartialEtoSpecData = DeepPartial<TEtoSpecsData>;
export type TPartialCompanyEtoData = DeepPartial<TCompanyEtoData>;

export type TGeneralEtoData = {
  etoData: TPartialEtoSpecData;
  companyData: TPartialCompanyEtoData;
};
