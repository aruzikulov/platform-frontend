import * as React from "react";

import { TPartialEtoSpecData } from "../../../lib/api/eto/EtoApi.interfaces";
import { getInvestmentAmount } from "../../../lib/api/eto/EtoUtils";
import { ECurrencySymbol, EMoneyFormat, Money } from "../../shared/Money";
import { ToHumanReadableForm } from "../../shared/ToHumanReadableForm";

type TExternalProps = {
  etoData: TPartialEtoSpecData;
};

const InvestmentAmount: React.SFC<TExternalProps> = ({ etoData }) => {
  const { minInvestmentAmount, maxInvestmentAmount } = getInvestmentAmount(etoData);

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
