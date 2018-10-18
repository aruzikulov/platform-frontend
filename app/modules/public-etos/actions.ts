import { TCompanyEtoData, TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces";
import { EEtoDocumentType, IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { Dictionary } from "../../types";
import { createAction, createSimpleAction } from "../actionsUtils";
import { IEtoContractData } from "./types";

export const etoActions = {
  // public actions
  loadEtoPreview: (previewCode: string) =>
    createAction("PUBLIC_ETOS_LOAD_ETO_PREVIEW", { previewCode }),
  loadEto: (etoId: string) => createAction("PUBLIC_ETOS_LOAD_ETO", { etoId }),
  loadEtos: () => createSimpleAction("PUBLIC_ETOS_LOAD_ETOS"),
  downloadPublicEtoDocument: (document: IEtoDocument) =>
    createAction("PUBLIC_ETOS_DOWNLOAD_DOCUMENT", { document }),
  downloadPublicEtoTemplateByType: (etoId: string, documentType: EEtoDocumentType) =>
    createAction("PUBLIC_ETOS_DOWNLOAD_TEMPLATE_BY_TYPE", { etoId, documentType }),
  // state mutations
  setPublicEtos: ({
    etos,
    companies,
  }: {
    etos: Dictionary<TEtoSpecsData>;
    companies: Dictionary<TCompanyEtoData>;
  }) => createAction("PUBLIC_ETOS_SET_PUBLIC_ETOS", { etos, companies }),
  setPublicEto: ({ eto, company }: { eto: TEtoSpecsData; company: TCompanyEtoData }) =>
    createAction("PUBLIC_ETOS_SET_PUBLIC_ETO", { eto, company }),
  setEtosDisplayOrder: (order: string[]) =>
    createAction("PUBLIC_ETOS_SET_DISPLAY_ORDER", { order }),
  setEtoDataFromContract: (previewCode: string, data: IEtoContractData) =>
    createAction("PUBLIC_ETOS_SET_ETO_DATA_FROM_CONTRACT", { previewCode, data }),
};
