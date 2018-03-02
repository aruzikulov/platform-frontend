import { effects } from "redux-saga";
import { all, take } from "redux-saga/effects";
import { symbols } from "../../di/symbols";
import { IUser } from "../../lib/api/users/interfaces";
import { UserNotExisting, UsersApi } from "../../lib/api/users/UsersApi";
import { ObjectStorage } from "../../lib/persistence/ObjectStorage";
import { TWalletMetadata } from "../../lib/persistence/WalletMetadataObjectStorage";
import { injectableFn } from "../../middlewares/redux-injectify";
import { actions } from "../actions";
import { callAndInject, forkAndInject } from "../sagas";
import { WalletType } from "../web3/types";

export const loadJwt = injectableFn(
  function*(storage: ObjectStorage<string>): Iterator<any> {
    const jwt = storage.get();
    if (jwt) {
      yield effects.put(actions.auth.loadJWT(jwt));
      return jwt;
    }
  },
  [symbols.jwtStorage],
);

export const loadUserPromise = injectableFn(
  async function(
    usersApi: UsersApi,
    walletMetadataStorage: ObjectStorage<TWalletMetadata>,
  ): Promise<IUser> {
    try {
      return await usersApi.me();
    } catch (e) {
      if (!(e instanceof UserNotExisting)) {
        throw e;
      }
    }

    // for light wallet we need to send slightly different request
    const walletMetadata = walletMetadataStorage.get();
    if (walletMetadata && walletMetadata.walletType === WalletType.LIGHT) {
      return usersApi.createAccount({
        unverifiedEmail: walletMetadata.email,
        salt: walletMetadata.salt,
        backupCodesVerified: true,
      });
    } else {
      return usersApi.createAccount();
    }
  },
  [symbols.usersApi, symbols.walletMetadataStorage],
);

export function* loadUser(): Iterator<any> {
  const user: IUser = yield callAndInject(loadUserPromise);
  yield effects.put(actions.auth.loadUser(user));
}

export const logoutWatcher = injectableFn(
  function*(
    jwtStorage: ObjectStorage<string>,
    walletMetadataStorage: ObjectStorage<TWalletMetadata>,
  ): Iterator<any> {
    while (true) {
      yield take("AUTH_LOGOUT");

      jwtStorage.clear();
      walletMetadataStorage.clear();
    }
  },
  [symbols.jwtStorage, symbols.walletMetadataStorage],
);

export const authSagas = function*(): Iterator<effects.Effect> {
  yield all([forkAndInject(logoutWatcher)]);
};