import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { SwitchConnected } from "../../../utils/connectedRouting";
import { EtoRegistrationCompanyInformation } from "./pages/CompanyInformation";
import { EtoEquityTokenInfo } from "./pages/EtoEquityTokenInfo";
import { EtoRegistrationMedia } from "./pages/EtoMedia";
import { EtoRegistrationPitch } from "./pages/EtoPitch";
import { EtoRegistrationTerms } from "./pages/EtoTerms";
import { EtoVotingRights } from "./pages/EtoVotingRights";
import { EtoInvestmentTerms } from "./pages/InvestmentTerms";
import { EtoRegistrationKeyIndividuals } from "./pages/KeyIndividuals";
import { EtoRegistrationLegalInformation } from "./pages/LegalInformation";
import { EtoRegistrationRiskAssessment } from "./pages/RiskAssessment";
import { etoRegisterRoutes } from "./routes";

export const EtoRegisterRouter: React.SFC = () => (
  <SwitchConnected>
    <Route
      path={etoRegisterRoutes.companyInformation}
      component={EtoRegistrationCompanyInformation}
      exact
    />
    <Route
      path={etoRegisterRoutes.legalInformation}
      render={({ location }) => (
        <EtoRegistrationLegalInformation readonly={location.state.readonly} />
      )}
      exact
    />
    <Route
      path={etoRegisterRoutes.keyIndividuals}
      component={EtoRegistrationKeyIndividuals}
      exact
    />
    <Route path={etoRegisterRoutes.productVision} component={EtoRegistrationPitch} exact />
    <Route
      path={etoRegisterRoutes.etoRiskAssessment}
      component={EtoRegistrationRiskAssessment}
      exact
    />
    <Route
      path={etoRegisterRoutes.etoTerms}
      render={({ location }) => <EtoRegistrationTerms readonly={location.state.readonly} />}
      exact
    />
    <Route
      path={etoRegisterRoutes.etoEquityTokenInfo}
      render={({ location }) => <EtoEquityTokenInfo readonly={location.state.readonly} />}
      exact
    />
    <Route
      path={etoRegisterRoutes.etoVotingRight}
      render={({ location }) => <EtoVotingRights readonly={location.state.readonly} />}
      exact
    />
    <Route
      path={etoRegisterRoutes.etoInvestmentTerms}
      render={({ location }) => <EtoInvestmentTerms readonly={location.state.readonly} />}
      exact
    />
    <Route path={etoRegisterRoutes.etoMedia} component={EtoRegistrationMedia} exact />
    <Redirect to={etoRegisterRoutes.companyInformation} />
  </SwitchConnected>
);
