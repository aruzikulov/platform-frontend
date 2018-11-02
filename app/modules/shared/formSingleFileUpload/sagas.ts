import { fork } from "redux-saga/effects";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { IHttpResponse } from "../../../lib/api/client/IHttpClient";
import { TFileDescription } from "../../../lib/api/FileStorage.interfaces";
import { TAction } from "../../actions";
import { neuTakeEvery } from "../../sagasUtils";

function* singleFileUpload(
  { fileStorageApi, notificationCenter }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "FORM_SINGLE_FILE_UPLOAD_START") return;
  const { file, onDone } = action.payload;

  try {
    const fileData: IHttpResponse<TFileDescription> = yield fileStorageApi.uploadFile(
      "image",
      file,
    );

    onDone(undefined, fileData.body.url);
  } catch (e) {
    notificationCenter.error("Error occured while uploading a file.");
    onDone(e, undefined);
  }
}

export function* formSingleFileUploadSagas(): any {
  yield fork(neuTakeEvery, "FORM_SINGLE_FILE_UPLOAD_START", singleFileUpload);
}
