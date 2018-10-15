import { effects } from "redux-saga";
import { call, fork, put, select } from "redux-saga/effects";

import { CHANGE_EMAIL_PERMISSION } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EmailAlreadyExists } from "../../lib/api/users/UsersApi";
import { IAppState } from "../../store";
import { accessWalletAndRunEffect } from "../accessWallet/sagas";
import { actions, TAction } from "../actions";
import { ensurePermissionsArePresent, loadUser, updateUser } from "../auth/sagas";
import { selectDoesEmailExist, selectUser } from "../auth/selectors";
import { neuCall, neuTakeEvery } from "../sagas";
import {
  selectLightWalletSalt,
  selectPreviousLightWalletSalt,
  selectWalletType,
} from "../web3/selectors";
import { EWalletType } from "../web3/types";

export function* addNewEmail(
  {
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "SETTINGS_ADD_NEW_EMAIL") return;

  const email = action.payload.email;
  const user = yield select((s: IAppState) => selectUser(s.auth));
  const walletType = yield select((s: IAppState) => selectWalletType(s.web3));
  const salt = yield select(
    (s: IAppState) => selectLightWalletSalt(s.web3) || selectPreviousLightWalletSalt(s.web3),
  );
  const isEmailAvailable = yield select((s: IAppState) => selectDoesEmailExist(s.auth));

  const emailModalTitle = isEmailAvailable ? "Email Update" : "Add Email";

  let addEmailMessage;

  try {
    switch (walletType) {
      case EWalletType.BROWSER:
        addEmailMessage = formatIntlMessage(
          "modules.settings.sagas.add-new-email.confirm-browser-wallet",
        );
        break;
      case EWalletType.LEDGER:
        addEmailMessage = formatIntlMessage(
          "modules.settings.sagas.add-new-email.confirm-ledger-wallet",
        );
        break;
      case EWalletType.LIGHT:
        addEmailMessage = formatIntlMessage(
          "modules.settings.sagas.add-new-email.confirm-light-wallet",
        );
        break;
      default:
        throw new Error("Wrong wallet type");
    }

    yield effects.put(actions.verifyEmail.lockVerifyEmailButton());
    yield neuCall(
      ensurePermissionsArePresent,
      [CHANGE_EMAIL_PERMISSION],
      emailModalTitle,
      addEmailMessage,
    );
    yield effects.call(updateUser, { ...user, new_email: email, salt: salt });
    notificationCenter.info(
      formatIntlMessage("modules.settings.sagas.add-new-email.new-email-added"),
    );
  } catch (e) {
    if (e instanceof EmailAlreadyExists)
      notificationCenter.error(
        formatIntlMessage("modules.auth.sagas.sign-in-user.email-already-exists"),
      );
    else notificationCenter.error(formatIntlMessage("modules.settings.sagas.add-new-email.error"));
  } finally {
    yield effects.call(loadUser);
    yield effects.put(actions.verifyEmail.freeVerifyEmailButton());
  }
}

export function* resendEmail(
  {
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "SETTINGS_RESEND_EMAIL") return;

  const user = yield select((s: IAppState) => selectUser(s.auth));
  const email = user.unverifiedEmail;
  const salt = yield select(
    (s: IAppState) => selectLightWalletSalt(s.web3) || selectPreviousLightWalletSalt(s.web3),
  );

  try {
    if (!email) throw new Error("No unverified email");

    yield neuCall(
      ensurePermissionsArePresent,
      [CHANGE_EMAIL_PERMISSION],
      formatIntlMessage("modules.settings.sagas.resend-email.confirmation"),
      formatIntlMessage("modules.settings.sagas.resend-email.confirmation-description"),
    );
    yield effects.call(updateUser, { ...user, new_email: email, salt: salt });
    notificationCenter.info(formatIntlMessage("modules.settings.sagas.resend-email.sent"));
  } catch {
    notificationCenter.error(formatIntlMessage("modules.settings.sagas.resend-email.failed"));
  }
}

export function* loadSeedOrReturnToSettings({
  intlWrapper: {
    intl: { formatIntlMessage },
  },
}: TGlobalDependencies): Iterator<any> {
  // unlock wallet
  try {
    const signEffect = put(actions.web3.fetchSeedFromWallet());
    return yield call(
      accessWalletAndRunEffect,
      signEffect,
      formatIntlMessage("modules.settings.sagas.load-seed-return-settings.access-recovery-phrase"),
      "",
    );
  } catch {
    yield put(actions.routing.goToSettings());
  }
}

export const settingsSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "SETTINGS_ADD_NEW_EMAIL", addNewEmail);
  yield fork(neuTakeEvery, "SETTINGS_RESEND_EMAIL", resendEmail);
  yield fork(neuTakeEvery, "LOAD_SEED_OR_RETURN_TO_SETTINGS", loadSeedOrReturnToSettings);
};
