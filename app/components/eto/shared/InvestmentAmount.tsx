import * as React from "react";

import { getInvestmentAmount } from "../../../lib/api/eto/EtoUtils";
import { ECurrencySymbol, EMoneyFormat, Money } from "../../shared/Money";
import { ToHumanReadableForm } from "../../shared/ToHumanReadableForm";

type TExternalProps = {
  preMoneyValuationEur: number | undefined;
  existingCompanyShares: number | undefined;
  newSharesToIssue: number | undefined;
  minimumNewSharesToIssue: number | undefined;
  newSharesToIssueInFixedSlots: number | undefined;
  newSharesToIssueInWhitelist: number | undefined;
  fixedSlotsMaximumDiscountFraction: number | undefined;
  whitelistDiscountFraction: number | undefined;
};

const InvestmentAmount: React.SFC<TExternalProps> = ({
  preMoneyValuationEur,
  existingCompanyShares,
  newSharesToIssue,
  whitelistDiscountFraction,
  fixedSlotsMaximumDiscountFraction,
  minimumNewSharesToIssue,
  newSharesToIssueInWhitelist,
  newSharesToIssueInFixedSlots,
}) => {
  const { minInvestmentAmount, maxInvestmentAmount } = getInvestmentAmount({
    minimumNewSharesToIssue,
    newSharesToIssue,
    newSharesToIssueInFixedSlots,
    newSharesToIssueInWhitelist,
    preMoneyValuationEur,
    fixedSlotsMaximumDiscountFraction,
    whitelistDiscountFraction,
    existingCompanyShares,
  });

  const value = (
    <ToHumanReadableForm number={minInvestmentAmount}>
      {divider => <ToHumanReadableForm number={maxInvestmentAmount} divider={divider} />}
    </ToHumanReadableForm>
  );

  return (
    <Money
      format={EMoneyFormat.FLOAT}
      currencySymbol={ECurrencySymbol.SYMBOL}
      currency="eur"
      value={value}
    />
  );
};

export { InvestmentAmount };
