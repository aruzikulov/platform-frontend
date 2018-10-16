import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import {
  selectTotalEtherBalance,
  selectTotalEtherBalanceEuroAmount,
  selectTotalEuroBalance,
  selectTotalEuroTokenBalance,
} from "../../../modules/wallet/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { ButtonLink, EButtonLayout } from "../../shared/buttons";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { ECurrencySymbol, Money } from "../../shared/Money";
import { MoneySuiteWidget } from "../../shared/MoneySuiteWidget";
import { Panel } from "../../shared/Panel";
import { WarningAlert } from "../../shared/WarningAlert";

import { CommonHtmlProps } from "../../../types";
import { appRoutes } from "../../appRoutes";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as moneyIcon from "../../../assets/img/nEUR_icon.svg";
import * as styles from "./MyWalletWidget.module.scss";

type StateProps = {
  isLoading: boolean;
  error?: string;
  data?: {
    euroTokenAmount: string;
    ethAmount: string;
    ethEuroAmount: string;
    totalAmount: string;
  };
};

export const MyWalletWidgetComponentBody: React.SFC<StateProps> = props => {
  if (props.isLoading) {
    return <LoadingIndicator />;
  } else if (props.error) {
    return <WarningAlert>{props.error}</WarningAlert>;
  } else {
    const { euroTokenAmount, ethAmount, ethEuroAmount, totalAmount } = props.data!;

    return (
      <>
        <Row>
          <Col className={styles.moneySuiteWrapper} xs={12} sm={6} lg={12}>
            <MoneySuiteWidget
              currency="eur_token"
              largeNumber={euroTokenAmount}
              icon={moneyIcon}
              value={euroTokenAmount}
              currencyTotal="eur"
              data-test-id="my-wallet-widget-eur-token"
            />
          </Col>
          <Col className={styles.moneySuiteWrapper} xs={12} sm={6} lg={12}>
            <MoneySuiteWidget
              currency="eth"
              largeNumber={ethAmount}
              icon={ethIcon}
              className={cn(styles.borderLeft, "pl-sm-2 pl-md-0")}
              value={ethEuroAmount}
              currencyTotal="eur"
              data-test-id="my-wallet-widget-eth-token"
            />
          </Col>
        </Row>
        <Row data-test-id="my-wallet-widget-total">
          <Col>
            <div className={`${styles.total} mt-3 mb-3 d-flex align-items-center`}>
              <span className={cn(styles.smallFont)}>
                <FormattedMessage id="dashboard.my-wallet-widget.total" />
              </span>
              <Money
                value={totalAmount}
                currency="eur"
                currencySymbol={ECurrencySymbol.NONE}
                className={cn(styles.money, "pl-1 pl-sm-2 m-0")}
              />
              <span className="pl-1">EUR</span>
            </div>
          </Col>
        </Row>
      </>
    );
  }
};

export const MyWalletWidgetComponent: React.SFC<CommonHtmlProps & StateProps> = ({
  className,
  style,
  ...props
}) => {
  return (
    <Panel
      headerText={
        <FormattedMessage id="components.dashboard.my-wallet.my-wallet-widget.header-text" />
      }
      rightComponent={
        <ButtonLink
          to={appRoutes.wallet}
          layout={EButtonLayout.SECONDARY}
          iconPosition="icon-after"
          theme="dark"
          svgIcon={arrowRight}
          className={cn(styles.link, "pr-0")}
        >
          <FormattedMessage id="dashboard.my-wallet-widget.main-wallet-redirect-button" />
        </ButtonLink>
      }
      className={className}
      style={style}
    >
      <MyWalletWidgetComponentBody {...props} />
    </Panel>
  );
};

export const MyWalletWidget = compose<React.SFC<CommonHtmlProps>>(
  onEnterAction({ actionCreator: d => d(actions.wallet.loadWalletData()) }),
  appConnect<StateProps>({
    stateToProps: s => {
      const isLoading = s.wallet.loading;
      const error = s.wallet.error;

      if (!isLoading && !error) {
        const state = s;
        return {
          isLoading,
          error,
          data: {
            euroTokenAmount: selectTotalEuroTokenBalance(state),
            ethAmount: selectTotalEtherBalance(state),
            ethEuroAmount: selectTotalEtherBalanceEuroAmount(state),
            totalAmount: selectTotalEuroBalance(state),
          },
        };
      } else {
        return {
          isLoading,
          error,
        };
      }
    },
  }),
)(MyWalletWidgetComponent);
