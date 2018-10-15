import * as React from "react";

import { ECurrencySymbol, EMoneyFormat, Money } from "../../shared/Money";
import { ToHumanReadableForm } from "../../shared/ToHumanReadableForm";

type TExternalProps = {
  preMoneyValuationEur: number | undefined;
  existingCompanyShares: number | undefined;
  newSharesToIssue: number | undefined;
  minimumNewSharesToIssue: number | undefined;
};

const InvestmentAmount: React.SFC<TExternalProps> = ({
  preMoneyValuationEur = 1,
  existingCompanyShares = 1,
  newSharesToIssue = 1,
  minimumNewSharesToIssue = 1,
}) => {
  const minimumNewShares = (preMoneyValuationEur / existingCompanyShares) * minimumNewSharesToIssue;
  const newShares = (preMoneyValuationEur / existingCompanyShares) * newSharesToIssue;

  const value = (
    <ToHumanReadableForm number={minimumNewShares}>
      {divider => <ToHumanReadableForm number={newShares} divider={divider} />}
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
