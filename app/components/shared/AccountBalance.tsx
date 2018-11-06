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
  withdrawDisabled?: boolean;
  transferDisabled?: boolean;
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
  withdrawDisabled,
  transferDisabled,
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
        <Button
          layout={EButtonLayout.SIMPLE}
          iconPosition="icon-after"
          theme="graphite"
          svgIcon={arrowRightIcon}
          onClick={onWithdrawClick}
          data-test-id={dataTestId && dataTestId + ".shared-component.withdraw.button"}
          disabled={withdrawDisabled}
        >
          <FormattedMessage id="shared-component.account-balance.withdraw" />
        </Button>
        <Button
          layout={EButtonLayout.SIMPLE}
          iconPosition="icon-after"
          theme="graphite"
          disabled={transferDisabled}
          svgIcon={arrowRightIcon}
          onClick={onDepositClick}
        >
          <FormattedMessage id="shared-component.account-balance.deposit" />
        </Button>
      </div>
    </div>
  );
};
