import * as React from "react";

import { FormattedMessage } from "react-intl";
import { Button } from "./Buttons";
import { IMoneySuiteWidgetProps, MoneySuiteWidget } from "./MoneySuiteWidget";

import * as arrowRightIcon from "../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./AccountBalance.module.scss";

interface IProps {
  onWithdrawClick?: () => void;
  onDepositClick?: () => void;
  onUpgradeClick?: () => void;
}

export const AccountBalance: React.SFC<IProps & IMoneySuiteWidgetProps> = ({
  icon,
  currency,
  currencyTotal,
  largeNumber,
  value,
  onWithdrawClick,
  onDepositClick,
  onUpgradeClick,
}) => {
  return (
    <div className={styles.accountBalance}>
      <MoneySuiteWidget
        icon={icon}
        currency={currency}
        currencyTotal={currencyTotal}
        largeNumber={largeNumber}
        value={value}
      />
      <div className={styles.buttons}>
        {onUpgradeClick ? (
          <Button
            layout="simple"
            iconPosition="icon-after"
            theme="graphite"
            svgIcon={arrowRightIcon}
            onClick={() => {}}
            disabled
          >
            <FormattedMessage id="shared-component.account-balance.upgrade" />
          </Button>
        ) : (
          <>
            <Button
              layout="simple"
              iconPosition="icon-after"
              theme="graphite"
              svgIcon={arrowRightIcon}
              onClick={onWithdrawClick}
              disabled={parseFloat(largeNumber) === 0}
            >
              <FormattedMessage id="shared-component.account-balance.withdraw" />
            </Button>
            <Button
              layout="simple"
              iconPosition="icon-after"
              theme="graphite"
              svgIcon={arrowRightIcon}
              onClick={onDepositClick}
            >
              <FormattedMessage id="shared-component.account-balance.deposit" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
