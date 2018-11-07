import * as queryString from "query-string";
import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { OnlyAuthorizedRoute } from "./shared/routing/OnlyAuthorizedRoute";
import { OnlyPublicRoute } from "./shared/routing/OnlyPublicRoute";

import { Dashboard } from "./dashboard/Dashboard";
import { Documents } from "./Documents";
import { EtoDashboard } from "./eto/EtoDashboard";
import { Kyc } from "./kyc/Kyc";
import { Portfolio } from "./portfolio";

import { SwitchConnected } from "../utils/connectedRouting";
import { appRoutes } from "./appRoutes";
import { EmailVerify } from "./EmailVerify";
import { EtoIssuerView } from "./eto/EtoIssuerView";
import { EtoPublicView } from "./eto/EtoPublicView";
import { EtoPublicViewByContractId } from "./eto/EtoPublicViewByContractId";
import { EtoWidgetView } from "./eto/EtoWidgetView";
import { EtoRegister } from "./eto/registration/Start";
import { Landing } from "./landing/Landing";
import { LandingEto } from "./landing/LandingEto";
import { BackupSeed } from "./settings/backup-seed/BackupSeed";
import { settingsRoutes } from "./settings/routes";
import { Settings } from "./settings/Settings";
import { WalletRecoverMain } from "./wallet-selector/wallet-recover/WalletRecoverMain";
import { WalletSelector } from "./wallet-selector/WalletSelector";
import { Wallet } from "./wallet/Wallet";

export const AppRouter: React.SFC = () => (
  <SwitchConnected>
    <Route
      path={appRoutes.etoPublicView}
      render={({ match }) => <EtoPublicView previewCode={match.params.previewCode} />}
      exact
    />

    <Route
      path={appRoutes.etoPublicViewById}
      render={({ match }) => <EtoPublicViewByContractId etoId={match.params.etoId} />}
      exact
    />

    <Route
      path={appRoutes.etoWidgetView}
      render={({ match }) => <EtoWidgetView previewCode={match.params.previewCode} />}
      exact
    />

    <OnlyPublicRoute path={appRoutes.root} component={Landing} exact />
    <OnlyPublicRoute path={appRoutes.register} component={WalletSelector} />
    <OnlyPublicRoute path={appRoutes.login} component={WalletSelector} />
    <OnlyPublicRoute path={appRoutes.restore} component={WalletRecoverMain} />

    {process.env.NF_ISSUERS_ENABLED === "1" && [
      <OnlyPublicRoute
        key={appRoutes.etoLanding}
        path={appRoutes.etoLanding}
        component={LandingEto}
      />,
      <OnlyPublicRoute
        key={appRoutes.registerEto}
        path={appRoutes.registerEto}
        component={EtoSecretProtectedWalletSelector}
      />,
      <OnlyPublicRoute
        key={appRoutes.loginEto}
        path={appRoutes.loginEto}
        component={EtoSecretProtectedWalletSelector}
      />,
      <OnlyPublicRoute
        key={appRoutes.restoreEto}
        path={appRoutes.restoreEto}
        component={WalletRecoverMain}
      />,
    ]}

    {/* only investors routes */}
    {process.env.NF_PORTFOLIO_PAGE_VISIBLE === "1" && (
      <OnlyAuthorizedRoute path={appRoutes.portfolio} investorComponent={Portfolio} />
    )}

    {/* only issuer routes */}
    <OnlyAuthorizedRoute path={appRoutes.documents} issuerComponent={Documents} />
    <OnlyAuthorizedRoute path={appRoutes.etoRegister} issuerComponent={EtoRegister} />
    <OnlyAuthorizedRoute path={appRoutes.etoIssuerView} issuerComponent={EtoIssuerView} exact />

    {/* common routes for both investors and issuers */}
    <OnlyAuthorizedRoute
      path={appRoutes.wallet}
      investorComponent={Wallet}
      issuerComponent={Wallet}
    />
    <OnlyAuthorizedRoute
      path={appRoutes.dashboard}
      investorComponent={Dashboard}
      issuerComponent={EtoDashboard}
      exact
    />
    <OnlyAuthorizedRoute
      path={appRoutes.verify}
      investorComponent={EmailVerify}
      issuerComponent={EmailVerify}
    />
    <OnlyAuthorizedRoute
      path={appRoutes.settings}
      investorComponent={Settings}
      issuerComponent={Settings}
      exact
    />
    <OnlyAuthorizedRoute
      path={settingsRoutes.seedBackup}
      investorComponent={BackupSeed}
      issuerComponent={BackupSeed}
      exact
    />
    <OnlyAuthorizedRoute path={appRoutes.kyc} investorComponent={Kyc} issuerComponent={Kyc} />

    <Redirect to={appRoutes.root} />
  </SwitchConnected>
);

const SecretProtected = (Component: any) =>
  class extends React.Component<any> {
    shouldComponentUpdate(): boolean {
      return false;
    }

    render(): React.ReactNode {
      const props = this.props;
      const params = queryString.parse(window.location.search);

      if (!process.env.NF_ISSUERS_SECRET || params.etoSecret === process.env.NF_ISSUERS_SECRET) {
        return <Component {...props} />;
      }

      return <Redirect to={appRoutes.root} />;
    }
  };
const EtoSecretProtectedWalletSelector = SecretProtected(WalletSelector);
