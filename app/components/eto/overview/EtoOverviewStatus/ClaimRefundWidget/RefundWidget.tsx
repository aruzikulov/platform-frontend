import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button } from "../../../../shared/buttons";

import * as styles from "./Layout.module.scss";
import { withCanClaimToken } from "./withCanClaimToken";

interface IExternalProps {
  canClaimToken: boolean;
}

const RefundWidgetLayout: React.SFC<IExternalProps> = ({ canClaimToken }) => {
  return (
    <div className={styles.widget}>
      <div className={styles.message}>
        <FormattedMessage id="shared-component.eto-overview.refund" />
      </div>
      {canClaimToken && (
        <Button>
          <FormattedMessage id="shared-component.eto-overview.claim-your-eth-neur" />
        </Button>
      )}
    </div>
  );
};

export const RefundWidget = withCanClaimToken(RefundWidgetLayout);
