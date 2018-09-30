import { fork, put } from "redux-saga/effects";

import { UPLOAD_IMMUTABLE_DOCUMENT } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { FileAlreadyExists } from "../../lib/api/eto/EtoFileApi";
import { EtoDocumentType, IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { actions, TAction } from "../actions";
import { ensurePermissionsArePresent } from "../auth/sagas";
import { downloadLink } from "../immutableFile/sagas";
import { neuCall, neuTakeEvery } from "../sagas";

export function* generateTemplate(
  { apiImmutableStorage, notificationCenter, logger, apiEtoFileService }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_DOCUMENTS_GENERATE_TEMPLATE") return;
  try {
    const immutableFileId = action.payload.immutableFileId;

    const templates = yield apiEtoFileService.getEtoTemplate({
      documentType: immutableFileId.documentType,
      name: immutableFileId.name,
      form: "template",
      ipfsHash: immutableFileId.ipfsHash,
      mimeType: immutableFileId.mimeType,
    });
    const generatedDocument = yield apiImmutableStorage.getFile({
      ...{
        ipfsHash: templates.ipfs_hash,
        mimeType: templates.mime_type,
        placeholders: templates.placeholders,
      },
      asPdf: false,
    });
    yield neuCall(downloadLink, generatedDocument, immutableFileId.name, ".doc");
  } catch (e) {
    logger.debug(e);
    notificationCenter.error("Failed to download file from IPFS");
  }
}

export function* downloadDocumentByType(
  { apiImmutableStorage, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_DOCUMENTS_DOWNLOAD_BY_TYPE") return;
  try {
    const matchingDocument = yield neuCall(getDocumentOfTypePromise, action.payload.documentType);
    const downloadedDocument = yield apiImmutableStorage.getFile({
      ipfsHash: matchingDocument.ipfsHash,
      mimeType: matchingDocument.mimeType,
      asPdf: true,
    });
    yield neuCall(downloadLink, downloadedDocument, matchingDocument.name, "");
  } catch (e) {
    logger.error(e);
    notificationCenter.error("Failed to download file");
  }
}

export function* loadEtoFileData({
  notificationCenter,
  apiEtoFileService,
}: TGlobalDependencies): any {
  try {
    yield put(actions.etoFlow.loadIssuerEto());
    const stateInfo = yield apiEtoFileService.getEtoFileStateInfo();
    const uploadedDocuments = yield apiEtoFileService.getAllEtoDocuments();
    const etoTemplates = yield apiEtoFileService.getAllEtoTemplates();
    yield put(
      actions.etoDocuments.loadEtoFileData({
        etoTemplates,
        uploadedDocuments,
        stateInfo,
      }),
    );
  } catch (e) {
    notificationCenter.error(
      "Could not access ETO files data. Make sure you have completed KYC and email verification process.",
    );
    yield put(actions.routing.goToDashboard());
  }
}

async function getDocumentOfTypePromise(
  { apiEtoFileService }: TGlobalDependencies,
  documentType: EtoDocumentType,
): Promise<IEtoDocument> {
  const documents: any = await apiEtoFileService.getAllEtoDocuments();
  const matchingDocument = Object.keys(documents).filter(ipfsHashKey => {
    if (documents[ipfsHashKey].documentType === documentType) return documents[ipfsHashKey];
  });
  return documents[matchingDocument[0]];
}

function* uploadEtoFile(
  {
    apiEtoFileService,
    notificationCenter,
    logger,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "ETO_DOCUMENTS_UPLOAD_DOCUMENT_START") return;
  const { file, documentType } = action.payload;
  try {
    yield put(actions.etoDocuments.hideIpfsModal());

    yield neuCall(
      ensurePermissionsArePresent,
      [UPLOAD_IMMUTABLE_DOCUMENT],
      formatIntlMessage("eto.modal.submit-description"),
    );

    const matchingDocument = yield neuCall(getDocumentOfTypePromise, documentType);
    if (matchingDocument)
      yield apiEtoFileService.deleteSpecificEtoDocument(matchingDocument.ipfsHash);

    yield apiEtoFileService.uploadEtoDocument(file, documentType);
    notificationCenter.info(formatIntlMessage("eto.modal.file-uploaded"));
  } catch (e) {
    logger.error("Failed to send ETO data", e);

    if (e instanceof FileAlreadyExists)
      notificationCenter.error(formatIntlMessage("eto.modal.file-already-exists"));
    else notificationCenter.error(formatIntlMessage("eto.modal.file-upload-failed"));
  } finally {
    yield put(actions.etoDocuments.loadFileDataStart());
  }
}

export function* etoDocumentsSagas(): any {
  yield fork(neuTakeEvery, "ETO_DOCUMENTS_GENERATE_TEMPLATE", generateTemplate);
  yield fork(neuTakeEvery, "ETO_DOCUMENTS_LOAD_FILE_DATA_START", loadEtoFileData);
  yield fork(neuTakeEvery, "ETO_DOCUMENTS_UPLOAD_DOCUMENT_START", uploadEtoFile);
  yield fork(neuTakeEvery, "ETO_DOCUMENTS_DOWNLOAD_BY_TYPE", downloadDocumentByType);
}
