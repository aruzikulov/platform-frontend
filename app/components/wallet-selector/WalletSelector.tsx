import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../modules/actions";
import {
  selectIsLoginRoute,
  selectOppositeRootPath,
  selectRootPath,
  selectUrlUserType,
} from "../../modules/wallet-selector/selectors";
import { appConnect } from "../../store";
import { IIntlProps, injectIntlHelpers } from "../../utils/injectIntlHelpers";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { appRoutes } from "../appRoutes";
import { LayoutRegisterLogin } from "../layouts/LayoutRegisterLogin";
import { LayoutUnauthorized } from "../layouts/LayoutUnauthorized";
import { TabContent, Tabs } from "../shared/Tabs";
import { WalletMessageSigner } from "./WalletMessageSigner";
import { WalletRouter } from "./WalletRouter";

interface IStateProps {
  isMessageSigning: boolean;
  rootPath: string;
  isLoginRoute: boolean;
  oppositeRoute: string;
  userType: string;
}

export const WalletSelectorComponent: React.SFC<IStateProps & IIntlProps> = ({
  isMessageSigning,
  rootPath,
  isLoginRoute,
  oppositeRoute,
  userType,
  intl: { formatIntlMessage },
}) => {
  const oppositeViewLabel = isLoginRoute
    ? formatIntlMessage("wallet-selector.neuwallet.register-link-text")
    : formatIntlMessage("wallet-selector.neuwallet.login-link-text");
  const oppositeViewLinkLabel = isLoginRoute
    ? formatIntlMessage("wallet-selector.register")
    : formatIntlMessage("wallet-selector.login");

  return (
    <LayoutRegisterLogin>
      {isMessageSigning ? (
        <WalletMessageSigner rootPath={rootPath} />
      ) : (
        <>
          <Row className="justify-content-center mb-4 mt-4">
            <Tabs>
              {(userType === "investor" ||
                process.env.NF_ISSUERS_CAN_LOGIN_WITH_ANY_WALLET === "1") && (
                <TabContent
                  data-test-id="wallet-selector-light"
                  routerPath={`${rootPath}/light`}
                  tab={
                    isLoginRoute
                      ? formatIntlMessage("wallet-selector.tabs.neuwallet-login")
                      : formatIntlMessage("wallet-selector.tabs.neuwallet-register")
                  }
                />
              )}
              {(userType === "investor" ||
                process.env.NF_ISSUERS_CAN_LOGIN_WITH_ANY_WALLET === "1") && (
                <TabContent
                  data-test-id="wallet-selector-browser"
                  routerPath={`${rootPath}/browser`}
                  tab={
                    isLoginRoute
                      ? formatIntlMessage("wallet-selector.tabs.browser-wallet-login")
                      : formatIntlMessage("wallet-selector.tabs.browser-wallet-register")
                  }
                />
              )}
              <TabContent
                data-test-id="wallet-selector-ledger"
                routerPath={`${rootPath}/ledger`}
                tab={
                  isLoginRoute
                    ? formatIntlMessage("wallet-selector.tabs.ledger-login")
                    : formatIntlMessage("wallet-selector.tabs.ledger-register")
                }
              />
            </Tabs>
          </Row>
          <Row>
            <Col>
              <WalletRouter rootPath={rootPath} />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col xs={12} sm={6}>
              <span>
                {isLoginRoute ? (
                  <>
                    <FormattedMessage id="wallet-selector.login.help-link" />{" "}
                    <Link to={appRoutes.restore}>
                      <FormattedMessage id="wallet-selector.help-link.label" />
                    </Link>
                  </>
                ) : (
                  <>
                    <FormattedMessage id="wallet-selector.register.help-link" />{" "}
                    <a href="https://support.neufund.org/support/home">
                      <FormattedMessage id="wallet-selector.help-link.label" />
                    </a>
                  </>
                )}
              </span>
            </Col>
            <Col xs={12} sm={6}>
              <span className="float-sm-right">
                {oppositeViewLabel}{" "}
                <Link to={oppositeRoute} data-test-id="wallet-selector-opposite-route-link">
                  {oppositeViewLinkLabel}
                </Link>
              </span>
            </Col>
          </Row>
        </>
      )}
    </LayoutRegisterLogin>
  );
};

export const WalletSelector = compose<React.SFC>(
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.walletSelector.reset()),
  }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      isMessageSigning: s.walletSelector.isMessageSigning,
      rootPath: selectRootPath(s.router),
      isLoginRoute: selectIsLoginRoute(s.router),
      userType: selectUrlUserType(s.router),
      oppositeRoute: selectOppositeRootPath(s.router),
    }),
  }),
  injectIntlHelpers,
  withContainer(LayoutUnauthorized),
)(WalletSelectorComponent);
