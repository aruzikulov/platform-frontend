import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { SwitchConnected } from "../shared/connectedRouting";
import { WalletBrowser } from "./browser/WalletBrowser";
import { WalletLedger } from "./ledger/WalletLedger";
import { WalletLight } from "./light/WalletLight";
import { getRedirectionUrl } from "./walletRouterHelpers";

interface IProps {
  rootPath: string;
}

export const WalletRouter: React.SFC<IProps> = ({ rootPath }) => (
  <SwitchConnected>
    <Route path={`${rootPath}/light`} component={WalletLight} exact />
    <Route path={`${rootPath}/browser`} component={WalletBrowser} exact />
    <Route path={`${rootPath}/ledger`} component={WalletLedger} exact />
    <Redirect to={getRedirectionUrl(rootPath)} />
  </SwitchConnected>
);
