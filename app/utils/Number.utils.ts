import BigNumber from "bignumber.js";

import { Q18 } from "../config/constants";
import { TBigNumberVariant } from "../lib/web3/types";
import { invariant } from "./invariant";

/**
 * Assumes dot as decimal separator
 */
export function formatThousands(value?: string): string {
  if (!value) return "";
  const splitByDot = value.split(".");

  invariant(splitByDot.length <= 2, "Can't format this number: " + value);

  const formattedBeforeDot = splitByDot[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  if (splitByDot.length === 2) {
    return formattedBeforeDot + "." + splitByDot[1];
  }
  return formattedBeforeDot;
}

export function convertToBigInt(value: TBigNumberVariant, currencyDecimals?: number): string {
  const q = currencyDecimals ? new BigNumber(10).pow(currencyDecimals) : Q18;
  const moneyInWei = q.mul(value);
  return moneyInWei.toFixed(0, BigNumber.ROUND_UP);
}
