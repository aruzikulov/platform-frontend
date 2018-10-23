import { multiplyBigNumbers } from "../../utils/BigNumberUtils";

export const GAS_PRICE_MULTIPLIER = 1 + parseFloat("0.50");

export const calculateGasPriceWithOverhead = (gasPrice: string) =>
  multiplyBigNumbers([gasPrice, GAS_PRICE_MULTIPLIER]);
