import { saveAs } from "file-saver";
import { fork } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { TAction } from "../actions";
import { neuCall, neuTakeEvery } from "../sagas";

export function* downloadFile(
  { apiImmutableStorage, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "IMMUTABLE_STORAGE_DOWNLOAD_FILE") return;
  try {
    const immutableFileId = action.payload.immutableFileId;
    const downloadedFile = yield apiImmutableStorage.getFile(immutableFileId);
    const extension = immutableFileId.asPdf ? ".pdf" : ".doc";

    yield neuCall(downloadLink, downloadedFile, action.payload.fileName, extension);
  } catch (e) {
    logger.debug(e);
    notificationCenter.error("Failed to download file from IPFS");
  }
}

export const immutableFileSagas = function*(): any {
  yield fork(neuTakeEvery, "IMMUTABLE_STORAGE_DOWNLOAD_FILE", downloadFile);
};

export function downloadLink(
  _deps: TGlobalDependencies,
  blob: Blob,
  name: string,
  fileExtension: string,
): void {
  saveAs(blob, name + fileExtension);
}
