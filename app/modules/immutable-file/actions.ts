import { ImmutableFileId } from "../../lib/api/ImmutableStorage.interfaces";
import { createAction } from "../actionsUtils";

export const immutableStorageActions = {
  downloadImmutableFile: (immutableFileId: ImmutableFileId, fileName: string) =>
    createAction("IMMUTABLE_STORAGE_DOWNLOAD_FILE", { immutableFileId, fileName }),
};
