import { multiplyBigNumbers } from "../../utils/BigNumberUtils";

export const GAS_PRICE_MULTIPLIER = 1 + parseFloat(process.env.NF_GAS_OVERHEAD || "0");

export const calculateGasPriceWithOverhead = (gasPrice: string) =>
  multiplyBigNumbers([gasPrice, GAS_PRICE_MULTIPLIER]);
