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
  RESERVATION_AND_ACQUISITION_AGREEMENT = "reservation_and_acquisition_agreement",
  COMPANY_TOKEN_HOLDER_AGREEMENT = "company_token_holder_agreement",
  INVESTMENT_AND_SHAREHOLDER_AGREEMENT = "investment_and_shareholder_agreement",
  PROSPECTUS_TEMPLATE = "prospectus_template",
  PAMPHLET_TEMPLATE = "pamphlet_template",
  TERMSHEET_TEMPLATE = "termsheet_template",
  APPROVED_PROSPECTUS = "approved_prospectus",
  APPROVED_PAMPHLET = "approved_pamphlet",
  SIGNED_INVESTMENT_AND_SHAREHOLDER_AGREEMENT = "signed_investment_and_shareholder_agreement",
  OTHER = "other",
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
  etoTemplates: TEtoDocumentTemplates;
  uploadedDocuments: TEtoDocumentTemplates;
  stateInfo?: { [key in TSimpleFileInfo]: EEtoDocumentType[] } &
    { [key in TComplextFileInfo]: { [key in EtoStateToCamelcase]: EEtoDocumentType[] } };
}

export type TEtoDocumentTemplates = { [key: string]: IEtoDocument };

export const immutableDocumentName: { [key: string]: string } = {
  company_token_holder_agreement: "Company Token Holder Agreement",
  investment_and_shareholder_agreement: "Investment and Shareholder Agreement",
  pamphlet_template: "Pamphlet Template",
  prospectus_template: "Prospectus Template",
  reservation_and_acquisition_agreement: "Reservation and Acquisition Agreement",
  termsheet_template: "Termsheet Template",
  approved_prospectus: "Approved Prospectus",
  approved_pamphlet: "Approved Pamphlet",
  signed_investment_and_shareholder_agreement: "Signed Investment and Shareholder Agreement",
};
