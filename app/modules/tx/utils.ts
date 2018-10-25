import BigNumber from "bignumber.js";
import { addHexPrefix } from "ethereumjs-util";
import { TxData } from "web3";
import { multiplyBigNumbers } from "../../utils/BigNumberUtils";

export const GAS_PRICE_MULTIPLIER = 1 + parseFloat(process.env.NF_GAS_OVERHEAD || "0");

export const EMPTY_DATA = "0x00";

export const calculateGasPriceWithOverhead = (gasPrice: string) =>
  new BigNumber(multiplyBigNumbers([gasPrice, GAS_PRICE_MULTIPLIER])).ceil().toString();

export const encodeTransaction = (txData: Partial<TxData>) => {
  return {
    from: addHexPrefix(txData.from!),
    to: addHexPrefix(txData.to!),
    gas: addHexPrefix(new BigNumber(txData.gas || 0).toString(16)),
    gasPrice: addHexPrefix(new BigNumber(txData.gasPrice || 0).toString(16)),
    value: addHexPrefix(new BigNumber(txData.value! || 0).toString(16)),
    data: addHexPrefix(txData.data || EMPTY_DATA),
  };
};

