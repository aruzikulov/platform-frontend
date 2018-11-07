import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button } from "../../../../shared/buttons";
import { ECurrencySymbol, Money } from "../../../../shared/Money";
import { Message } from "../Message";
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
  <>
    <Message
      title={<FormattedMessage id="shared-component.eto-overview.success" />}
      summary={
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
      }
    />
    {canClaimToken && (
      <Button>
        <FormattedMessage
          id="shared-component.eto-overview.claim-your-token"
          values={{ tokenName }}
        />
      </Button>
    )}
  </>
);

export const ClaimWidget = withCanClaimToken(ClaimWidgetLayout);
