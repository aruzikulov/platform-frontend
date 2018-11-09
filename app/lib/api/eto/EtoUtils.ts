import { TEtoWithCompanyAndContract } from "../../../modules/public-etos/types";
import { FirstParameterType, OmitKeys } from "../../../types";
import { TEtoSpecsData } from "./EtoApi.interfaces";

type TInvestmentAmountOwnArguments = {
  newSharesToIssue: number | undefined;
  minimumNewSharesToIssue: number | undefined;
};

type TInvestmentAmount = TInvestmentAmountOwnArguments &
  FirstParameterType<typeof getSharePrice> &
  OmitKeys<FirstParameterType<typeof getMaxInvestmentAmountWithDiscount>, "shares" | "sharePrice">;

export const getInvestmentAmount = ({
  newSharesToIssue = 0,
  minimumNewSharesToIssue = 0,
  preMoneyValuationEur,
  existingCompanyShares,
  ...rest
}: TInvestmentAmount) => {
  const sharePrice = getSharePrice({ preMoneyValuationEur, existingCompanyShares });

  return {
    minInvestmentAmount: getMaxInvestmentAmountWithDiscount({
      shares: minimumNewSharesToIssue,
      sharePrice,
      ...rest,
    }),
    maxInvestmentAmount: getMaxInvestmentAmountWithDiscount({
      shares: newSharesToIssue,
      sharePrice,
      ...rest,
    }),
  };
};

export const getSharePrice = ({ preMoneyValuationEur = 0, existingCompanyShares = 0 }) => {
  if (existingCompanyShares === 0 || preMoneyValuationEur === 0) {
    return 0;
  }

  return preMoneyValuationEur / existingCompanyShares;
};

const getMaxInvestmentAmountWithDiscount = ({
  sharePrice = 0,
  shares = 0,
  newSharesToIssueInFixedSlots = 0,
  newSharesToIssueInWhitelist = 0,
  fixedSlotsMaximumDiscountFraction = 0,
  whitelistDiscountFraction = 0,
}) => {
  if (sharePrice === 0 || shares === 0) {
    return 0;
  }

  let amount = 0;

  if (newSharesToIssueInFixedSlots > 0 && shares > 0) {
    const minShares = Math.min(newSharesToIssueInFixedSlots, shares);

    amount += minShares * sharePrice * (1 - fixedSlotsMaximumDiscountFraction);
    shares -= minShares;
  }

  if (newSharesToIssueInWhitelist > 0 && shares > 0) {
    const minShares = Math.min(newSharesToIssueInWhitelist, shares);

    amount += minShares * sharePrice * (1 - whitelistDiscountFraction);
    shares -= minShares;
  }

  if (shares > 0) {
    amount += shares * sharePrice;
  }

  return amount;
};

export const getInvestmentCalculatedPercentage = (eto: TEtoSpecsData) => {
  return (eto.newSharesToIssue / eto.minimumNewSharesToIssue) * 100;
};

export const getCurrentInvestmentProgressPercentage = (eto: TEtoWithCompanyAndContract) => {
  const totalTokensInt = eto.contract!.totalInvestment.totalTokensInt.toNumber();

  return (totalTokensInt / (eto.minimumNewSharesToIssue * eto.equityTokensPerShare)) * 100;
};
