import { IEtoFiles } from "../../lib/api/eto/EtoFileApi.interfaces";
import { IEtoDocumentState } from "./reducer";

export const selectIsIpfsModalOpen = (state: IEtoDocumentState): boolean => state.showIpfsModal;

export const selectFileUploadAction = (state: IEtoDocumentState): (() => void) | undefined =>
  state.uploadAction;

export const selectEtoDocumentLoading = (state: IEtoDocumentState): boolean => state.loading;

export const selectEtoDocumentData = (state: IEtoDocumentState): IEtoFiles => state.etoFileData;
