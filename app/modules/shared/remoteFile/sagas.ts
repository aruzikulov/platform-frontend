import { fork } from "redux-saga/effects";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { IHttpResponse } from "../../../lib/api/client/IHttpClient";
import { TFileDescription } from "../../../lib/api/FileStorage.interfaces";
import { TAction } from "../../actions";
import { neuTakeEvery } from "../../sagasUtils";

function* getRemoteFile(
  { fileStorageApi, notificationCenter }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "REMOTE_FILE_GET") return;
  const { fileUrl, onDone } = action.payload;

  try {
    const fileData: IHttpResponse<TFileDescription> = yield fileStorageApi.getFile(fileUrl);

    onDone(undefined, fileData.body);
  } catch (e) {
    notificationCenter.error("Error occured getting remote file details");
    onDone(e, undefined);
  }
}

export function* remoteFileSagas(): any {
  yield fork(neuTakeEvery, "REMOTE_FILE_GET", getRemoteFile);
}
