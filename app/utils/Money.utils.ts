import BigNumber from "bignumber.js";

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
