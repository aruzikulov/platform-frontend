import { EtoStateToCamelcase } from "./EtoApi.interfaces";

type fileStates = "canReplace" | "locked" | "readOnly";

export interface IEtoSingleFile {
  url: string;
  status: fileStates;
}

export interface IEtoLinkFile {
  url: string;
  name: string;
}

export interface IEtoGeneratedFile {
  url: string;
  title: string;
}

export enum EEtoDocumentType {
  COMPANY_TOKEN_HOLDER_AGREEMENT = "company_token_holder_agreement",
  RESERVATION_AND_ACQUISITION_AGREEMENT = "reservation_and_acquisition_agreement",
  INVESTMENT_AND_SHAREHOLDER_AGREEMENT_TEMPLATE = "investment_and_shareholder_agreement_template",
  PROSPECTUS_TEMPLATE = "prospectus_template",
  PAMPHLET_TEMPLATE = "pamphlet_template",
  TERMSHEET_TEMPLATE = "termsheet_template",
  INVESTMENT_MEMORANDUM_TEMPLATE = "investment_memorandum_template",
  // in documents collection
  SIGNED_TERMSHEET = "signed_termsheet",
  APPROVED_INVESTOR_OFFERING_DOCUMENT = "approved_investor_offering_document",
  INVESTMENT_AND_SHAREHOLDER_AGREEMENT = "investment_and_shareholder_agreement",
  SIGNED_INVESTMENT_AND_SHAREHOLDER_AGREEMENT = "signed_investment_and_shareholder_agreement",
}

type TEtoFormType = "document" | "template";

export interface IEtoDocument {
  documentType: EEtoDocumentType;
  form: TEtoFormType;
  ipfsHash: string;
  mimeType: string;
  name: string;
  placeholders?: { [key: string]: string };
}

type TComplextFileInfo = "canDeleteInStates" | "canUploadInStates";

type TSimpleFileInfo = "requiredTemplates" | "uploadableDocuments";

export interface IEtoFiles {
  allTemplates: TEtoDocumentTemplates;
  stateInfo?: { [key in TSimpleFileInfo]: EEtoDocumentType[] } &
    { [key in TComplextFileInfo]: { [key in EtoStateToCamelcase]: EEtoDocumentType[] } };
}

export type TEtoDocumentTemplates = { [key: string]: IEtoDocument };

export const immutableDocumentName: { [key in EEtoDocumentType]: string } = {
  company_token_holder_agreement: "Company Token Holder Agreement",
  reservation_and_acquisition_agreement: "Reservation and Acquisition Agreement",
  investment_and_shareholder_agreement_template: "Investment and Shareholder Agreement Template",
  pamphlet_template: "Pamphlet Template",
  prospectus_template: "Prospectus Template",
  termsheet_template: "Termsheet Template",
  investment_memorandum_template: "Investment Memorandum Template",
  // in document collection
  investment_and_shareholder_agreement: "Investment and Shareholder Agreement",
  approved_investor_offering_document: "Approved Offering Document",
  signed_termsheet: "Signed Termsheet",
  signed_investment_and_shareholder_agreement: "Signed Investment and Shareholder Agreement",
};
