import BigNumber from "bignumber.js";
import { delay } from "redux-saga";
import { put, select, takeEvery, takeLatest } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { ITxData } from "../../lib/web3/types";
import { IAppState } from "../../store";
import { addBigNumbers, compareBigNumbers } from "../../utils/BigNumberUtils";
import { isLessThanNDays } from "../../utils/Date.utils";
import { convertToBigInt } from "../../utils/Number.utils";
import { extractNumber } from "../../utils/StringUtils";
import { actions, TAction } from "../actions";
import { loadComputedContributionFromContract } from "../investor-tickets/sagas";
import { selectCalculatedContribution, selectIsWhitelisted } from "../investor-tickets/selectors";
import {
  selectEtoById,
  selectEtoOnChainStateById,
  selectEtoWithCompanyAndContractById,
} from "../public-etos/selectors";
import { EETOStateOnChain } from "../public-etos/types";
import { neuCall } from "../sagasUtils";
import { selectEtherPriceEur } from "../shared/tokenPrice/selectors";
import { ETxSenderType } from "../tx/interfaces";
import { selectTxGasCostEth } from "../tx/sender/selectors";
import { txValidateSaga } from "../tx/validator/sagas";
import {
  selectLiquidEtherBalance,
  selectLockedEtherBalance,
  selectLockedEuroTokenBalance,
} from "../wallet/selectors";
import {
  EBankTransferFlowState,
  EInvestmentCurrency,
  EInvestmentErrorState,
  EInvestmentType,
  IInvestmentFlowState,
} from "./reducer";
import {
  selectCurrencyByInvestmentType,
  selectInvestmentEthValueUlps,
  selectInvestmentEtoId,
  selectInvestmentEurValueUlps,
  selectInvestmentType,
  selectIsBankTransferModalOpened,
  selectIsICBMInvestment,
} from "./selectors";

function* processCurrencyValue(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_SUBMIT_INVESTMENT_VALUE") return;
  const state: IAppState = yield select();

  const value = action.payload.value && convertToBigInt(extractNumber(action.payload.value));
  const curr = action.payload.currency;
  const oldVal =
    curr === EInvestmentCurrency.Ether
      ? selectInvestmentEthValueUlps(state)
      : selectInvestmentEurValueUlps(state);

  // stop if value has not changed. allows editing fractions without overriding user input.
  if (compareBigNumbers(oldVal || "0", value || "0") === 0) return;

  yield put(actions.investmentFlow.setIsInputValidated(false));
  yield computeAndSetCurrencies(value, curr);
  // dispatch in order to debounce, instead of calling directly
  yield put(actions.investmentFlow.validateInputs());
}

function* computeAndSetCurrencies(value: string, currency: EInvestmentCurrency): any {
  const state: IAppState = yield select();
  const etherPriceEur = selectEtherPriceEur(state.tokenPrice);
  if (!value) {
    yield put(actions.investmentFlow.setEthValue(""));
    yield put(actions.investmentFlow.setEurValue(""));
  } else if (etherPriceEur && etherPriceEur !== "0") {
    const bignumber = new BigNumber(value);
    switch (currency) {
      case EInvestmentCurrency.Ether:
        const eurVal = bignumber.mul(etherPriceEur);
        yield put(actions.investmentFlow.setEthValue(bignumber.toFixed(0, BigNumber.ROUND_UP)));
        yield put(actions.investmentFlow.setEurValue(eurVal.toFixed(0, BigNumber.ROUND_UP)));
        return;
      case EInvestmentCurrency.Euro:
        const ethVal = bignumber.div(etherPriceEur);
        yield put(actions.investmentFlow.setEthValue(ethVal.toFixed(0, BigNumber.ROUND_UP)));
        yield put(actions.investmentFlow.setEurValue(bignumber.toFixed(0, BigNumber.ROUND_UP)));
        return;
    }
  }
}

function validateInvestment(state: IAppState): EInvestmentErrorState | undefined {
  const investmentFlow = state.investmentFlow;
  const euroValue = investmentFlow.euroValueUlps;
  const etherValue = investmentFlow.ethValueUlps;
  const wallet = state.wallet.data;
  const contribs = selectCalculatedContribution(investmentFlow.etoId, state);

  if (!contribs || !euroValue || !wallet) return;

  const gasPrice = selectTxGasCostEth(state);

  if (investmentFlow.investmentType === EInvestmentType.InvestmentWallet) {
    if (
      compareBigNumbers(
        addBigNumbers([etherValue, gasPrice]),
        selectLiquidEtherBalance(state.wallet),
      ) > 0
    ) {
      return EInvestmentErrorState.ExceedsWalletBalance;
    }
  }

  if (investmentFlow.investmentType === EInvestmentType.ICBMnEuro) {
    if (compareBigNumbers(euroValue, selectLockedEuroTokenBalance(state.wallet)) > 0) {
      return EInvestmentErrorState.ExceedsWalletBalance;
    }
  }

  if (investmentFlow.investmentType === EInvestmentType.ICBMEth) {
    if (compareBigNumbers(etherValue, selectLockedEtherBalance(state.wallet)) > 0) {
      return EInvestmentErrorState.ExceedsWalletBalance;
    }
  }

  if (compareBigNumbers(euroValue, contribs.minTicketEurUlps) < 0) {
    return EInvestmentErrorState.BelowMinimumTicketSize;
  }

  if (compareBigNumbers(euroValue, contribs.maxTicketEurUlps) > 0) {
    return EInvestmentErrorState.AboveMaximumTicketSize;
  }

  if (contribs.maxCapExceeded) {
    return EInvestmentErrorState.ExceedsTokenAmount;
  }

  return;
}

function* validateAndCalculateInputs({ contractsService }: TGlobalDependencies): any {
  // debounce validation
  yield delay(300);

  let state: IAppState = yield select();
  const eto = selectEtoById(state.publicEtos, state.investmentFlow.etoId);
  const value = state.investmentFlow.euroValueUlps;
  if (value && eto) {
    const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);
    if (etoContract) {
      const isICBM = selectIsICBMInvestment(state);
      yield neuCall(loadComputedContributionFromContract, eto, value, isICBM);
      state = yield select();
      yield put(actions.investmentFlow.setErrorState(validateInvestment(state)));

      // validate and set transaction if not on bank transfer
      if (state.investmentFlow.investmentType !== EInvestmentType.BankTransfer) {
        const txData: ITxData = yield neuCall(
          txValidateSaga,
          actions.txValidator.txSenderValidateDraft({ type: ETxSenderType.INVEST }),
        );
        yield put(actions.txSender.setTransactionData(txData));
      }

      yield put(actions.investmentFlow.setIsInputValidated(true));
    }
  } else {
    yield put(actions.investmentFlow.setErrorState());
  }
}

function* start(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_START") return;
  yield put(actions.investmentFlow.resetInvestment());
  yield put(actions.investmentFlow.setEtoId(action.payload.etoId));
  yield put(actions.kyc.kycLoadClientData());
  yield put(actions.txTransactions.startInvestment());
  yield getActiveInvestmentTypes();
  yield resetTxValidations();
}

export function* onInvestmentTxModalHide(): any {
  const isModalOpen = yield select(selectIsBankTransferModalOpened);
  if (!isModalOpen) {
    yield put(actions.investmentFlow.resetInvestment());
  }
}

function* getActiveInvestmentTypes(): any {
  const state: IAppState = yield select();
  const etoId = selectInvestmentEtoId(state);
  const eto = selectEtoWithCompanyAndContractById(state, etoId);
  const etoState = selectEtoOnChainStateById(state.publicEtos, etoId);

  let activeTypes: EInvestmentType[] = [
    EInvestmentType.InvestmentWallet,
    EInvestmentType.BankTransfer,
  ];

  // no public bank transfer 3 days before eto end
  const etoEndDate = eto && eto.contract && eto.contract.startOfStates[EETOStateOnChain.Signing];
  if (
    etoState === EETOStateOnChain.Public &&
    etoEndDate &&
    isLessThanNDays(new Date(), etoEndDate, 3)
  ) {
    activeTypes.splice(1); // remove bank transfer
  }

  // no whitelist bank transfer 3 days before public eto
  const etoEndWhitelistDate =
    eto && eto.contract && eto.contract.startOfStates[EETOStateOnChain.Public];
  if (
    etoState === EETOStateOnChain.Whitelist &&
    etoEndWhitelistDate &&
    isLessThanNDays(new Date(), etoEndWhitelistDate, 3)
  ) {
    activeTypes.splice(1); // remove bank transfer
  }

  // no regular investment if not whitelisted in pre eto
  if (etoState === EETOStateOnChain.Whitelist && !selectIsWhitelisted(etoId, state)) {
    activeTypes = [];
  }

  // only ICBM investment if balance available
  if (compareBigNumbers(selectLockedEuroTokenBalance(state.wallet), 0) > 0) {
    activeTypes.unshift(EInvestmentType.ICBMnEuro);
  }
  if (compareBigNumbers(selectLockedEtherBalance(state.wallet), 0) > 0) {
    activeTypes.unshift(EInvestmentType.ICBMEth);
  }

  yield put(actions.investmentFlow.setActiveInvestmentTypes(activeTypes));

  // guarantee that current type is inside active types.
  const currentType = selectInvestmentType(state);
  if (currentType && !activeTypes.includes(currentType)) {
    yield put(actions.investmentFlow.selectInvestmentType(activeTypes[0]));
  }
}

function* recalculateCurrencies(): any {
  yield delay(100); // wait for new token price to be available
  const s: IAppState = yield select();
  const curr = selectCurrencyByInvestmentType(s);
  const ethVal = selectInvestmentEthValueUlps(s);
  const eurVal = selectInvestmentEurValueUlps(s);
  if (curr === EInvestmentCurrency.Ether && ethVal) {
    yield computeAndSetCurrencies(ethVal, curr);
  } else if (eurVal) {
    yield computeAndSetCurrencies(eurVal, curr);
  }
}

function* showBankTransferDetails(): any {
  const state: IInvestmentFlowState = yield select((s: IAppState) => s.investmentFlow);
  if (state.investmentType !== EInvestmentType.BankTransfer) return;
  yield put(actions.investmentFlow.setBankTransferFlowState(EBankTransferFlowState.Details));
  yield put(actions.txSender.txSenderHideModal());
}

function* showBankTransferSummary(): any {
  const state: IInvestmentFlowState = yield select((s: IAppState) => s.investmentFlow);
  if (state.investmentType !== EInvestmentType.BankTransfer) return;
  yield put(actions.investmentFlow.setBankTransferFlowState(EBankTransferFlowState.Summary));
  yield put(actions.txSender.txSenderHideModal());
}

function* bankTransferChange(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_BANK_TRANSFER_CHANGE") return;
  yield put(actions.txSender.txSenderChange(action.payload.type));
}

function* resetTxValidations(): any {
  yield put(actions.txValidator.setValidationState());
  yield put(actions.txSender.setTransactionData());
}

export function* investmentFlowSagas(): any {
  yield takeEvery("INVESTMENT_FLOW_SUBMIT_INVESTMENT_VALUE", processCurrencyValue);
  yield takeLatest("INVESTMENT_FLOW_VALIDATE_INPUTS", neuCall, validateAndCalculateInputs);
  yield takeEvery("INVESTMENT_FLOW_START", start);
  yield takeEvery("INVESTMENT_FLOW_SHOW_BANK_TRANSFER_SUMMARY", showBankTransferSummary);
  yield takeEvery("INVESTMENT_FLOW_SHOW_BANK_TRANSFER_DETAILS", showBankTransferDetails);
  yield takeEvery("TOKEN_PRICE_SAVE", recalculateCurrencies);
  yield takeEvery("INVESTMENT_FLOW_BANK_TRANSFER_CHANGE", bankTransferChange);
  yield takeEvery("INVESTMENT_FLOW_SELECT_INVESTMENT_TYPE", resetTxValidations);
}
