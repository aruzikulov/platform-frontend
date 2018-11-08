import BigNumber from "bignumber.js";

/**
 * Formats number to desired decimals and precision.
 * IMPORTANT: Use only for display in UI, not for currency calculations in business logic!
 */
export function formatMoney(
  value: string | BigNumber | number,
  currencyDecimals: number,
  decimalPlaces?: number,
): string {
  const money = new BigNumber(value.toString());
  const moneyInPrimaryBase = money.div(new BigNumber(10).pow(currencyDecimals));
  return decimalPlaces !== undefined
    ? moneyInPrimaryBase.toFixed(decimalPlaces, BigNumber.ROUND_UP)
    : moneyInPrimaryBase.toString();
}
