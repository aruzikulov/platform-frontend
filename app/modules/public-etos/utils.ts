import BigNumber from "bignumber.js";
import { EETOStateOnChain, IEtoTotalInvestment, TEtoStartOfStates } from "./types";

export const convertToEtoTotalInvestment = ([totalEquivEurUlps, totalTokensInt, totalInvestors]: [
  BigNumber,
  BigNumber,
  BigNumber
]): IEtoTotalInvestment => ({
  totalEquivEurUlps,
  totalTokensInt,
  totalInvestors,
});

const convertToDate = (startOf: BigNumber): Date | undefined => {
  if (startOf.isZero()) {
    return undefined;
  }

  return new Date(startOf.mul(1000).toNumber());
};

export const convertToStateStartDate = (
  startOfStates: [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber],
): TEtoStartOfStates => {
  const [
    startOfSetup,
    startOfWhitelist,
    startOfPublic,
    startOfSigning,
    startOfClaim,
    startOfPayout,
    startOfRefund,
  ] = startOfStates.map(convertToDate);

  return {
    [EETOStateOnChain.Setup]: startOfSetup,
    [EETOStateOnChain.Whitelist]: startOfWhitelist,
    [EETOStateOnChain.Public]: startOfPublic,
    [EETOStateOnChain.Signing]: startOfSigning,
    [EETOStateOnChain.Claim]: startOfClaim,
    [EETOStateOnChain.Payout]: startOfPayout,
    [EETOStateOnChain.Refund]: startOfRefund,
  };
};
