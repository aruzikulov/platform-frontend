import { TFormFixture } from "../utils/forms";

const kycPersonBaseForm: TFormFixture = {
  firstName: "John",
  lastName: "Doe",
  birthDate: {
    value: "20/01/1980",
    type: "date",
  },
  street: "Cuvrystr. 6",
  city: "Berlin",
  zipCode: "10247",
  country: {
    value: "DE",
    type: "select",
  },
  placeOfBirth: {
    value: "AT",
    type: "select",
  },
  nationality: {
    value: "PL",
    type: "select",
  },
  isPoliticallyExposed: {
    value: "false",
    type: "select",
  },
};

export const kycInvidualForm: TFormFixture = {
  ...kycPersonBaseForm,
  isUsCitizen: {
    value: "false",
    type: "select",
  },
  isHighIncome: {
    value: "true",
    type: "select",
  },
  "kyc-personal-start-submit-form": {
    type: "submit",
  },
};

export const kycLegalRepForm: TFormFixture = {
  ...kycPersonBaseForm,
  "kyc-company-legal-representative-save": {
    type: "submit",
  },
};

export const kycLegalRepDocsForm: TFormFixture = {
  "kyc-company-legal-representative-documents": {
    value: "example.jpg",
    type: "file",
  },
  "kyc-company-legal-representative-upload-and-submit": {
    type: "submit",
  },
};

export const kycCompanyForm: TFormFixture = {
  name: "Neufund",
  registrationNumber: "123456789",
  legalForm: "UG",
  street: "Cuvrystraße 6",
  city: "Berlin",
  zipCode: "10247",
  country: {
    value: "DE",
    type: "select",
  },
  "kyc-company-business-data-save": {
    type: "submit",
  },
};

export const kycCorporateCompanyForm: TFormFixture = {
  ...kycCompanyForm,
  jurisdiction: {
    value: "PL",
    type: "select",
  },
};

export const kycCompanyDocsForm: TFormFixture = {
  "kyc-company-business-supporting-documents": {
    value: "example.jpg",
    type: "file",
  },
  "kyc-company-business-supporting-continue": {
    type: "submit",
  },
};
