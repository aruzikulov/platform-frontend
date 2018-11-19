import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { TCompanyEtoData } from "../../../lib/api/eto/EtoApi.interfaces";
import {
  EEtoDocumentType,
  TEtoDocumentTemplates,
} from "../../../lib/api/eto/EtoFileApi.interfaces";
import { DocumentsWidgetLayout } from "./DocumentsWidget";

const marketingLinks: TCompanyEtoData["marketingLinks"] = [
  {
    title: "Pitch Deck",
    url:
      "https://docs.google.com/presentation/d/14mRlEDSNAMWybfgYFJUJyE8oEps0VJPIoaYfmmpZTmw/edit#slide=id.g3e534cab92_0_70",
  },
];

const documents: TEtoDocumentTemplates = {
  QmRnodXSfXVpMV2PTtJFU5wyNGi1Q8gCt8JKZAU1L2bZ6u: {
    documentType: EEtoDocumentType.SIGNED_INVESTMENT_AND_SHAREHOLDER_AGREEMENT,
    form: "document",
    ipfsHash: "QmRnodXSfXVpMV2PTtJFU5wyNGi1Q8gCt8JKZAU1L2bZ6u",
    mimeType: "application/pdf",
    name: "./dev_fixtures/eto_fixtures/ETOInPublicState/bafin_approved_pamphlet.pdf",
  },
  QmWKa6zVZjZu3x2CtJnSNTHUwWMeAcyfv9iZDnoawmULeT: {
    documentType: EEtoDocumentType.APPROVED_INVESTOR_OFFERING_DOCUMENT,
    form: "document",
    ipfsHash: "QmWKa6zVZjZu3x2CtJnSNTHUwWMeAcyfv9iZDnoawmULeT",
    mimeType: "application/pdf",
    name: "./dev_fixtures/eto_fixtures/ETOInPublicState/bafin_approved_prospectus.pdf",
  },
  Qmc4rZUXQKkvRahSUHS6qaeRq2voqDiMXbiHwhZTfwXUdK: {
    documentType: EEtoDocumentType.SIGNED_TERMSHEET,
    form: "document",
    ipfsHash: "Qmc4rZUXQKkvRahSUHS6qaeRq2voqDiMXbiHwhZTfwXUdK",
    mimeType: "application/pdf",
    name: "./dev_fixtures/eto_fixtures/ETOInPublicState/termsheet_template.pdf",
  },
};

const templates: TEtoDocumentTemplates = {
  companyTokenHolderAgreement: {
    documentType: EEtoDocumentType.COMPANY_TOKEN_HOLDER_AGREEMENT,
    form: "template",
    ipfsHash: "QmY7ffdrJTATRdi1vLodadEu2sReNraHvLDX8a6BeqUnfj",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    name: "company_token_holder_agreement",
  },
  investmentAndShareholderAgreementTemplate: {
    documentType: EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT_TEMPLATE,
    form: "template",
    ipfsHash: "QmdMTU4Z58cvaDAKWChLCH5DaYFvNWG9Qo1cvkzzzLMZ16",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    name: "investment_and_shareholder_agreement_template",
  },
  prospectusTemplate: {
    documentType: EEtoDocumentType.PROSPECTUS_TEMPLATE,
    form: "template",
    ipfsHash: "QmQYWyx6WWwCYqBnJ74ruogTTHfKoscQRHU5eJFKDD22mT",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    name: "prospectus_template_de",
  },
  reservationAndAcquisitionAgreement: {
    documentType: EEtoDocumentType.RESERVATION_AND_ACQUISITION_AGREEMENT,
    form: "template",
    ipfsHash: "QmZptRv7Y4z2Z9yQQvXZ7MVPM3zP5hCCb2kDtgBssrfZ9Y",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    name: "reservation_and_acquisition_agreement",
  },
  termsheetTemplate: {
    documentType: EEtoDocumentType.TERMSHEET_TEMPLATE,
    form: "template",
    ipfsHash: "QmRLwyTw4ux84KnYvhejTsUggi2SeewGqASuh3DrURtyot",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    name: "termsheet_template",
  },
};

storiesOf("Document/DocumentsWidget", module)
  .add("default", () => (
    <DocumentsWidgetLayout
      etoTemplates={templates}
      etoDocuments={documents}
      companyMarketingLinks={marketingLinks}
      downloadDocument={action("download document")}
      isRetailEto={false}
    />
  ))
  .add("retail ETO", () => (
    <DocumentsWidgetLayout
      etoTemplates={templates}
      etoDocuments={documents}
      companyMarketingLinks={marketingLinks}
      downloadDocument={action("download document")}
      isRetailEto={true}
    />
  ));
