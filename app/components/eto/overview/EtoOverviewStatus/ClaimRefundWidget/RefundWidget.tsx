import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button } from "../../../../shared/buttons";
import { Message } from "../Message";
import { withCanClaimToken } from "./withCanClaimToken";

interface IExternalProps {
  canClaimToken: boolean;
}

const RefundWidgetLayout: React.SFC<IExternalProps> = ({ canClaimToken }) => {
  return (
    <>
      <Message
        showTick={false}
        summary={<FormattedMessage id="shared-component.eto-overview.refund" />}
      />
      {canClaimToken && (
        <Button>
          <FormattedMessage id="shared-component.eto-overview.claim-your-eth-neur" />
        </Button>
      )}
    </>
  );
};

export const RefundWidget = withCanClaimToken(RefundWidgetLayout);
