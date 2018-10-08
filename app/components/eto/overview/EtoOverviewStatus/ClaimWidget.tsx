import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button } from "../../../shared/buttons";
import { ECurrencySymbol, Money } from "../../../shared/Money";
import { SuccessTick } from "../../../shared/SuccessTick";

import * as styles from "./ClaimWidget.module.scss";

export interface IClaimWidget {
  tokenName: string;
  totalInvestors: number | undefined;
  totalEquivEurUlps: BigNumber;
  isPayout: boolean;
}

const ClaimWidget: React.SFC<IClaimWidget> = ({
  tokenName,
  totalInvestors,
  totalEquivEurUlps,
  isPayout,
}) => (
  <div className={styles.claimWidget}>
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
    {isPayout && (
      <Button>
        <FormattedMessage id="shared-component.eto-overview.claim-your-token" /> {tokenName}
      </Button>
    )}
  </div>
);

export { ClaimWidget };
