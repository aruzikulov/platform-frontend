import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button } from "../../../../shared/buttons";
import { ECurrencySymbol, Money } from "../../../../shared/Money";
import { SuccessTick } from "../../../../shared/SuccessTick";

import * as styles from "./Layout.module.scss";
import { withCanClaimToken } from "./withCanClaimToken";

interface IExternalProps {
  tokenName: string;
  totalInvestors: number | undefined;
  totalEquivEurUlps: BigNumber;
  canClaimToken: boolean;
}

const ClaimWidgetLayout: React.SFC<IExternalProps> = ({
  tokenName,
  totalInvestors,
  totalEquivEurUlps,
  canClaimToken,
}) => (
  <div className={styles.widget}>
    <SuccessTick />
    <div className={styles.message}>
      <FormattedMessage id="shared-component.eto-overview.success" />
      <p>
        <FormattedMessage
          id="shared-component.eto-overview.success.summary"
          values={{
            totalAmount: (
              <Money
                value={totalEquivEurUlps}
                currency="eur"
                currencySymbol={ECurrencySymbol.SYMBOL}
              />
            ),
            totalInvestors,
          }}
        />
      </p>
    </div>
    {canClaimToken && (
      <Button>
        <FormattedMessage id="shared-component.eto-overview.claim-your-token" /> {tokenName}
      </Button>
    )}
  </div>
);

export const ClaimWidget = withCanClaimToken(ClaimWidgetLayout);
