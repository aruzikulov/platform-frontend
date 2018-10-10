import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button, EButtonLayout } from "./buttons";
import { IMoneySuiteWidgetProps, MoneySuiteWidget } from "./MoneySuiteWidget";

import * as arrowRightIcon from "../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./AccountBalance.module.scss";

interface IProps {
  onWithdrawClick?: () => void;
  onDepositClick?: () => void;
  onUpgradeClick?: () => void;
  dataTestId?: string;
  disabled?: boolean;
}

export const AccountBalance: React.SFC<IProps & IMoneySuiteWidgetProps> = ({
  icon,
  currency,
  currencyTotal,
  largeNumber,
  disabled,
  value,
  onWithdrawClick,
  onDepositClick,
  onUpgradeClick,
  dataTestId,
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
        {onUpgradeClick && (
          <Button
            layout={EButtonLayout.SIMPLE}
            iconPosition="icon-after"
            theme="graphite"
            svgIcon={arrowRightIcon}
            onClick={onUpgradeClick}
            disabled={disabled}
          >
            <FormattedMessage id="shared-component.account-balance.upgrade" />
          </Button>
        )}
        {(onWithdrawClick || onDepositClick) && (
          <>
            <Button
              layout={EButtonLayout.SIMPLE}
              iconPosition="icon-after"
              theme="graphite"
              svgIcon={arrowRightIcon}
              onClick={onWithdrawClick}
              data-test-id={dataTestId && dataTestId + ".shared-component.withdraw.button"}
              disabled={process.env.NF_WITHDRAW_ENABLED !== "1" || parseFloat(largeNumber) === 0}
            >
              <FormattedMessage id="shared-component.account-balance.withdraw" />
            </Button>
            <Button
              layout={EButtonLayout.SIMPLE}
              iconPosition="icon-after"
              theme="graphite"
              disabled={process.env.NF_WITHDRAW_ENABLED !== "1" || !onDepositClick}
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
