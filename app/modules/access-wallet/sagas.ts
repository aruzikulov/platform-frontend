import { delay } from "bluebird";
import { Effect, effects } from "redux-saga";
import { call, put, race, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import {
  IBrowserWalletMetadata,
  ILedgerWalletMetadata,
  ILightWalletRetrieveMetadata,
} from "../../lib/persistence/WalletMetadataObjectStorage";
import { BrowserWalletConnector } from "../../lib/web3/BrowserWallet";
import { LedgerWalletConnector } from "../../lib/web3/LedgerWallet";
import { LightWalletConnector, LightWalletUtil } from "../../lib/web3/LightWallet";
import { IPersonalWallet } from "../../lib/web3/PersonalWeb3";
import { SignerError, Web3Manager } from "../../lib/web3/Web3Manager";
import { IAppState } from "../../store";
import { invariant } from "../../utils/invariant";
import { actions, TAction } from "../actions";
import { neuCall } from "../sagasUtils";
import { unlockWallet } from "../web3/sagas";
import { selectIsLightWallet, selectIsUnlocked } from "../web3/selectors";
import { EWalletType } from "../web3/types";
import { mapSignMessageErrorToErrorMessage, MismatchedWalletAddressError } from "./errors";
import { selectIsSigning } from "./reducer";

export async function ensureWalletConnection({
  web3Manager,
  walletStorage,
  lightWalletConnector,
  ledgerWalletConnector,
  browserWalletConnector,
}: TGlobalDependencies): Promise<void> {
  if (web3Manager.personalWallet) {
    return;
  }
  /* tslint:disable: no-useless-cast */
  const metadata = walletStorage.get()!;
  /* tslint:enable: no-useless-cast */

  invariant(metadata, "User has JWT but doesn't have wallet metadata!");

  let wallet: IPersonalWallet;
  switch (metadata.walletType) {
    case EWalletType.LEDGER:
      wallet = await connectLedger(ledgerWalletConnector, web3Manager, metadata);
      break;
    case EWalletType.BROWSER:
      wallet = await connectBrowser(browserWalletConnector, web3Manager, metadata);
      break;
    case EWalletType.LIGHT:
      wallet = await connectLightWallet(lightWalletConnector, metadata);
      break;
    default:
      return invariant(false, "Wallet type unrecognized");
  }

  // verify if newly plugged wallet address is the same as before. Mismatch can happen for multiple reasons:
  //  - user selects different wallet in user interface (metamask)
  //  - user attaches different ledger device
  const isSameAddress = wallet.ethereumAddress.toLowerCase() === metadata.address.toLowerCase();
  if (!isSameAddress) {
    throw new MismatchedWalletAddressError(metadata.address, wallet.ethereumAddress);
  }

  await web3Manager.plugPersonalWallet(wallet);
}

async function connectLedger(
  ledgerWalletConnector: LedgerWalletConnector,
  web3Manager: Web3Manager,
  metadata: ILedgerWalletMetadata,
): Promise<IPersonalWallet> {
  await ledgerWalletConnector.connect(web3Manager.networkId);
  return await ledgerWalletConnector.finishConnecting(metadata.derivationPath);
}

async function connectBrowser(
  browserWalletConnector: BrowserWalletConnector,
  web3Manager: Web3Manager,
  // tslint:disable-next-line
  metadata: IBrowserWalletMetadata,
): Promise<IPersonalWallet> {
  return await browserWalletConnector.connect(web3Manager.networkId);
}

export async function connectLightWallet(
  lightWalletConnector: LightWalletConnector,
  metadata: ILightWalletRetrieveMetadata,
  password?: string,
): Promise<IPersonalWallet> {
  const lightWalletUtils = new LightWalletUtil();
  const walletInstance = await lightWalletUtils.deserializeLightWalletVault(
    metadata.vault,
    metadata.salt,
  );

  return await lightWalletConnector.connect(
    {
      walletInstance,
      salt: metadata.salt,
    },
    metadata.email,
    password,
  );
}

function* unlockLightWallet(): any {
  const acceptAction: TAction = yield take("ACCESS_WALLET_ACCEPT");
  if (acceptAction.type !== "ACCESS_WALLET_ACCEPT") {
    return;
  }
  const isUnlocked = yield select((s: IAppState) => selectIsUnlocked(s.web3));

  if (!isUnlocked) {
    yield neuCall(unlockWallet, acceptAction.payload.password);
  }
}

export function* connectWalletAndRunEffect(effect: Effect | Iterator<Effect>): any {
  while (true) {
    try {
      yield neuCall(ensureWalletConnection);

      yield effects.put(actions.signMessageModal.clearSigningError());

      const isLightWallet = yield select((s: IAppState) => selectIsLightWallet(s.web3));
      if (isLightWallet) {
        yield call(unlockLightWallet);
      }
      return yield effect;
    } catch (e) {
      yield effects.put(
        actions.signMessageModal.signingError(mapSignMessageErrorToErrorMessage(e)),
      );
      if (e instanceof SignerError) throw e;
      yield delay(500);
    }
  }
}

export function* accessWalletAndRunEffect(
  effect: Effect | Iterator<Effect>,
  title: string = "",
  message: string = "",
): any {
  // guard against multiple modals
  const isSigning: boolean = yield select((s: IAppState) => selectIsSigning(s.accessWallet));
  if (isSigning) {
    throw new Error("Signing already in progress");
  }
  yield put(actions.signMessageModal.showAccessWalletModal(title, message));

  // do required operation, or finish in case cancel button was hit
  const { result, cancel } = yield race({
    result: call(connectWalletAndRunEffect, effect),
    cancel: take("HIDE_ACCESS_WALLET_MODAL"),
  });

  // always hide the current modal
  yield effects.put(actions.signMessageModal.hideAccessWalletModal());

  // if the cancel action was called
  // throw here
  if (cancel) {
    throw new Error("Cancelled");
  }

  return result;
}

/**
 * Use only as a part of another saga. This won't trigger modal.
 */
export function* connectWallet(): any {
  yield connectWalletAndRunEffect(call(() => {}));
}

/**
 * Main Message signing entry point
 * Can be moved elsewhere later
 */
export function* signMessage(
  { web3Manager }: TGlobalDependencies,
  messageToSign: string,
  title: string = "",
  message: string = "",
): any {
  try {
    const signEffect = call(web3Manager.sign.bind(web3Manager), messageToSign);
    return yield call(accessWalletAndRunEffect, signEffect, title, message);
  } catch {
    throw new Error("Message signing failed");
  }
}
