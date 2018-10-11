import { ITxData } from "../../lib/web3/Web3Manager";
import { multiplyBigNumbers } from "../../utils/BigNumberUtils";

export const getTxGasCostEth = (txData: ITxData) =>
  multiplyBigNumbers([txData.gasPrice, txData.gas]);
