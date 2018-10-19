import { selectStandardGasPrice } from "./../gas/selectors";
import { IAppState } from "../../store";
import { addBigNumbers, compareBigNumbers, multiplyBigNumbers } from "../../utils/BigNumberUtils";
import { convertToBigInt } from "../../utils/Money.utils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { EInvestmentCurrency, EInvestmentType, IInvestmentFlowState } from "./reducer";
import { selectGasPrice } from "../gas/selectors";

// State Selectors

export const selectEthValueUlps = (state: IInvestmentFlowState) => state.ethValueUlps;

export const selectEurValueUlps = (state: IInvestmentFlowState) => state.euroValueUlps;

export const selectErrorState = (state: IInvestmentFlowState) => state.errorState;

export const selectInvestmentType = (state: IInvestmentFlowState) => state.investmentType;

// Derived Values

export const selectIsICBMInvestment = (state: IInvestmentFlowState) =>
  state.investmentType === EInvestmentType.ICBMEth ||
  state.investmentType === EInvestmentType.ICBMnEuro;

export const selectReadyToInvest = (state: IInvestmentFlowState) =>
  !!(
    state.euroValueUlps &&
    state.isValidatedInput &&
    !state.errorState &&
    compareBigNumbers(state.euroValueUlps, 0) > 0
  );

export const selectCurrencyByInvestmentType = (state: IInvestmentFlowState) =>
  state.investmentType === EInvestmentType.InvestmentWallet ||
  state.investmentType === EInvestmentType.ICBMEth
    ? EInvestmentCurrency.Ether
    : EInvestmentCurrency.Euro;

export const selectIsBankTransferModalOpened = (state: IInvestmentFlowState) =>
  state.investmentType === EInvestmentType.BankTransfer &&
  !!state.bankTransferFlowState &&
  selectReadyToInvest(state);

export const selectBankTransferReferenceCode = (state: IAppState) => {
  const addressHex = selectEthereumAddressWithChecksum(state).slice(2);

  const bytes: number[] = [];
  for (let c = 0; c < addressHex.length; c += 2) {
    bytes.push(parseInt(addressHex.substr(c, 2), 16));
  }
  const byteString = bytes.map(n => String.fromCharCode(n)).join("");
  const base64 = btoa(byteString).replace("=", "");

  let code = "NF " + base64;
  if (state.investmentFlow.bankTransferGasStipend) {
    code += " G";
  }

  return code;
  // see https://github.com/Neufund/platform-backend/wiki/5.4.-Use-Case-EUR-T-deposit for reference
};

export const GAS_STIPEND_PRICE = convertToBigInt("10");

export const selectBankTransferAmount = (state: IInvestmentFlowState) => {
  const eur = selectEurValueUlps(state);
  return state.bankTransferGasStipend ? addBigNumbers([GAS_STIPEND_PRICE, eur]) : eur;
};

export const selectInvestmentGasLimit = (state: IAppState): string =>
  state.investmentFlow.gasAmount;

export const selectInvestmentGasCostEth = (state: IAppState) => {
  return multiplyBigNumbers([selectStandardGasPrice(state), selectInvestmentGasLimit(state)]);
};
