import { BigNumber } from "bignumber.js";
import { delay } from "bluebird";
import { toChecksumAddress } from "ethereumjs-util";
import { fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { actions, TAction } from "../actions";
import { downloadLink } from "../immutable-file/sagas";
import { neuCall, neuTakeEvery, neuTakeUntil } from "../sagasUtils";
import { ILockedWallet, IWalletStateData } from "../wallet/reducer";
import { loadWalletDataAsync } from "../wallet/sagas";
import { selectLockedWalletConnected } from "../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { IWalletMigrationData } from "./reducer";
import { selectIcbmModalIsFirstTransactionDone, selectIcbmWalletEthAddress } from "./selectors";

const BLOCK_MINING_TIME_DELAY = 12000;
class IcbmWalletError extends Error {}
class NoIcbmWalletError extends IcbmWalletError {}
class SameUserError extends IcbmWalletError {}

function hasIcbmWallet(lockedWallet: ILockedWallet): boolean {
  return lockedWallet.unlockDate !== "0";
}

const didUserConductFirstTransaction = (
  investorMigrationWallet: [string[], BigNumber[]],
  currentEthAddress: string,
) =>
  // If a user added more than one address then we consider him to be a power user
  !!(
    investorMigrationWallet[0].length === 1 &&
    investorMigrationWallet[0][0] &&
    investorMigrationWallet[0][0].toLowerCase() === currentEthAddress.toLowerCase()
  );

function* loadIcbmWalletMigrationTransactionSaga({
  logger,
  notificationCenter,
  contractsService,
}: TGlobalDependencies): any {
  try {
    const currentEthAddress: string = yield select(selectEthereumAddressWithChecksum);
    const icbmEthAddress: string = yield select(selectIcbmWalletEthAddress);
    const isFirstTxDone: boolean = yield select(selectIcbmModalIsFirstTransactionDone);

    const investorMigrationWallet: [
      string[],
      BigNumber[]
    ] = yield contractsService.etherLock.getInvestorMigrationWallets(icbmEthAddress);

    const etherLockAddress = yield contractsService.etherLock.address;
    const icbmEtherLockAddress = yield contractsService.icbmEtherLock.address;

    const walletMigrationData: IWalletMigrationData[] = [
      {
        migrationInputData: contractsService.etherLock
          .setInvestorMigrationWalletTx(currentEthAddress)
          .getData(),
        smartContractAddress: toChecksumAddress(etherLockAddress),
        gasLimit: "400000",
        value: "0",
      },
      {
        migrationInputData: contractsService.icbmEtherLock.migrateTx().getData(),
        smartContractAddress: toChecksumAddress(icbmEtherLockAddress),
        gasLimit: "400000",
        value: "0",
      },
    ];

    if (
      didUserConductFirstTransaction(investorMigrationWallet, currentEthAddress) &&
      !isFirstTxDone
    )
      yield put(actions.icbmWalletBalanceModal.setFirstTxDone());

    yield put(actions.icbmWalletBalanceModal.loadIcbmMigrationData(walletMigrationData));
  } catch (e) {
    logger.error("Error: ", e);
    return notificationCenter.error("Error while running migration tool");
  }
}

function* loadIcbmWalletMigrationSaga(
  { logger, notificationCenter }: TGlobalDependencies,
  action: TAction,
): any {
  const ethAddress = yield select(selectIcbmWalletEthAddress);

  if (action.type !== "ICBM_WALLET_BALANCE_MODAL_GET_WALLET_DATA") return;
  try {
    const userAddress = yield select(selectEthereumAddressWithChecksum);
    if (userAddress === ethAddress) throw new SameUserError();

    const migrationWalletData: IWalletStateData = yield neuCall(loadWalletDataAsync, ethAddress);
    const isIcbmUser = hasIcbmWallet(migrationWalletData.etherTokenICBMLockedWallet);
    if (!isIcbmUser) throw new NoIcbmWalletError();

    yield put(
      actions.icbmWalletBalanceModal.loadIcbmWalletData(
        migrationWalletData.etherTokenICBMLockedWallet,
      ),
    );
    yield put(actions.icbmWalletBalanceModal.showIcbmWalletBalanceModal());
    yield neuCall(loadIcbmWalletMigrationTransactionSaga);
  } catch (e) {
    yield put(actions.icbmWalletBalanceModal.hideIcbmWalletBalanceModal());
    logger.error("Load ICBM migration wallet", e);
    // todo: all texts to text resources
    if (e instanceof NoIcbmWalletError)
      return notificationCenter.error(
        "We were unable to find an ICBM wallet for the entered address.",
      );
    if (e instanceof SameUserError) return notificationCenter.error("This is your current address");
    // Default Error
    return notificationCenter.error("Error while loading ICBM Wallet data");
  }
}

function* icbmWalletMigrationTransactionWatcher({ contractsService }: TGlobalDependencies): any {
  const currentEthAddress = yield select(selectEthereumAddressWithChecksum);
  const icbmEthAddress = yield select(selectIcbmWalletEthAddress);
  if (currentEthAddress === icbmEthAddress) return;
  let isFirstRun = true;

  while (true) {
    // Check for first migration transaction
    const investorMigrationWallet = yield contractsService.etherLock.getInvestorMigrationWallets(
      icbmEthAddress,
    );
    // Check for second migration transaction
    const isLockedWalletConnected = yield select(selectLockedWalletConnected);

    if (isFirstRun) {
      // Second Transaction already done no need for watching transactions
      if (isLockedWalletConnected) return;
      // First Transaction Done, Go Directly to Second Step
      if (didUserConductFirstTransaction(investorMigrationWallet, currentEthAddress)) {
        yield put(actions.icbmWalletBalanceModal.startMigrationFlow());
        yield put(actions.icbmWalletBalanceModal.setMigrationStepToNextStep());
      }
      isFirstRun = false;
    } else {
      if (didUserConductFirstTransaction(investorMigrationWallet, currentEthAddress)) {
        yield put(actions.icbmWalletBalanceModal.setFirstTxDone());
        yield put(actions.icbmWalletBalanceModal.getWalletData(icbmEthAddress));
      }
      if (isLockedWalletConnected) yield put(actions.icbmWalletBalanceModal.setSecondTxDone());

      yield delay(BLOCK_MINING_TIME_DELAY);
    }
  }
}

function* downloadICBMWalletAgreement(
  {
    contractsService,
    apiImmutableStorage,
    logger,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ICBM_WALLET_BALANCE_MODAL_DOWNLOAD_AGREEMENT") return;

  const [, , agreementUrl] = yield contractsService.euroLock.currentAgreement();
  const fileUri = agreementUrl.replace("ipfs:", "");

  try {
    const generatedDocument = yield apiImmutableStorage.getFile({
      ipfsHash: fileUri,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      asPdf: true,
    });

    yield neuCall(
      downloadLink,
      generatedDocument,
      formatIntlMessage("wallet.icbm.reservation-agreement"),
      ".pdf",
    );
  } catch (e) {
    logger.error("Failed to download ICBM wallet agreement", e);
    notificationCenter.error("Failed to download ICBM Wallet Agreement");
  }
}

export function* icbmWalletGetDataSagas(): any {
  yield fork(
    neuTakeEvery,
    "ICBM_WALLET_BALANCE_MODAL_GET_WALLET_DATA",
    loadIcbmWalletMigrationSaga,
  );
  yield fork(
    neuTakeUntil,
    "ICBM_WALLET_BALANCE_MODAL_SHOW",
    "ICBM_WALLET_BALANCE_MODAL_HIDE",
    icbmWalletMigrationTransactionWatcher,
  );
  yield fork(
    neuTakeEvery,
    "ICBM_WALLET_BALANCE_MODAL_DOWNLOAD_AGREEMENT",
    downloadICBMWalletAgreement,
  );
}
