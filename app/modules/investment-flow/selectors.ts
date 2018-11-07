import { IAppState } from "../../store";
import { addBigNumbers, compareBigNumbers } from "../../utils/BigNumberUtils";
import { convertToBigInt } from "../../utils/Number.utils";
import { selectEtoOnChainStateById } from "../public-etos/selectors";
import { EETOStateOnChain } from "../public-etos/types";
import { EValidationState } from "../tx/sender/reducer";
import { selectTxValidationState } from "../tx/sender/selectors";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { EInvestmentCurrency, EInvestmentType } from "./reducer";

// State Selectors

export const selectInvestmentEthValueUlps = (state: IAppState) => state.investmentFlow.ethValueUlps;

export const selectInvestmentEurValueUlps = (state: IAppState) =>
  state.investmentFlow.euroValueUlps;

export const selectInvestmentErrorState = (state: IAppState) => state.investmentFlow.errorState;

export const selectInvestmentType = (state: IAppState) => state.investmentFlow.investmentType;

export const selectInvestmentEtoId = (state: IAppState) => state.investmentFlow.etoId;

export const selectIsInvestmentInputValidated = (state: IAppState) =>
  state.investmentFlow.isValidatedInput;

export const selectInvestmentActiveTypes = (state: IAppState) =>
  state.investmentFlow.activeInvestmentTypes;

export const selectBankTransferFlowState = (state: IAppState) =>
  state.investmentFlow.bankTransferFlowState;

export const selectIsBankTransferGasStipend = (state: IAppState) =>
  state.investmentFlow.bankTransferGasStipend;

// Derived Values

export const selectIsICBMInvestment = (state: IAppState) => {
  const type = selectInvestmentType(state);
  return type === EInvestmentType.ICBMEth || type === EInvestmentType.ICBMnEuro;
};

export const selectIsReadyToInvest = (state: IAppState) => {
  const ethValue = selectInvestmentEthValueUlps(state);
  const type = selectInvestmentType(state);
  return !!(
    ethValue &&
    !selectInvestmentErrorState(state) &&
    selectIsInvestmentInputValidated(state) &&
    compareBigNumbers(ethValue, 0) > 0 &&
    (type !== EInvestmentType.BankTransfer
      ? selectTxValidationState(state) === EValidationState.VALIDATION_OK
      : true)
  );
};

export const selectCurrencyByInvestmentType = (state: IAppState) => {
  const type = selectInvestmentType(state);
  return type === EInvestmentType.InvestmentWallet || type === EInvestmentType.ICBMEth
    ? EInvestmentCurrency.Ether
    : EInvestmentCurrency.Euro;
};

export const selectIsBankTransferModalOpened = (state: IAppState) =>
  selectInvestmentType(state) === EInvestmentType.BankTransfer &&
  !!selectBankTransferFlowState(state) &&
  selectIsReadyToInvest(state);

export const selectBankTransferReferenceCode = (state: IAppState) => {
  const addressHex = selectEthereumAddressWithChecksum(state).slice(2);

  const bytes: number[] = [];
  for (let c = 0; c < addressHex.length; c += 2) {
    bytes.push(parseInt(addressHex.substr(c, 2), 16));
  }
  const byteString = bytes.map(n => String.fromCharCode(n)).join("");
  const base64 = btoa(byteString).replace("=", "");

  let code = "NF " + base64;
  if (selectIsBankTransferGasStipend(state)) {
    code += " G";
  }

  const etoState = selectEtoOnChainStateById(state.publicEtos, selectInvestmentEtoId(state));
  if (etoState === EETOStateOnChain.Whitelist) {
    code += " WL";
  }

  return code;
  // see https://github.com/Neufund/platform-backend/wiki/5.4.-Use-Case-EUR-T-deposit for reference
};

export const GAS_STIPEND_PRICE = convertToBigInt("10");

export const selectBankTransferAmount = (state: IAppState) => {
  const eur = selectInvestmentEurValueUlps(state);
  return selectIsBankTransferGasStipend(state) ? addBigNumbers([GAS_STIPEND_PRICE, eur]) : eur;
};
