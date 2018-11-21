import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";

import { EtoKeyIndividualsType } from "../../../../lib/api/eto/EtoApi.interfaces";
import { EtoRegistrationCompanyInformationComponent } from "./CompanyInformation";
import { EtoEquityTokenInfoComponent } from "./EtoEquityTokenInfo";
import { EtoRegistrationMediaComponent } from "./EtoMedia";
import { EtoRegistrationPitchComponent } from "./EtoPitch";
import { EtoRegistrationTermsComponent } from "./EtoTerms";
import { EtoVotingRightsComponent } from "./EtoVotingRights";
import { EtoInvestmentTermsComponent } from "./InvestmentTerms";
import { EtoRegistrationKeyIndividualsComponent } from "./KeyIndividuals";
import { EtoRegistrationLegalInformationComponent } from "./LegalInformation";
import { EtoRegistrationRiskAssessmentComponent } from "./RiskAssessment";

const eto = {};
const company = {};
const loadingState = {
  loadingData: false,
  savingData: false,
  readonly: false,
  stateValues: eto,
  company,
  saveData: () => {},
};

storiesOf("ETO-Flow/Registration-forms", module)
  .add("EtoEquityTokenInfo", () => (
    <Provider store={createStore(() => ({}))}>
      <Formik initialValues={eto} onSubmit={() => {}}>
        {props => <EtoEquityTokenInfoComponent {...props} {...loadingState} />}
      </Formik>
    </Provider>
  ))
  .add("EtoRegistrationCompanyInformation", () => (
    <Provider store={createStore(() => ({}))}>
      <Formik initialValues={eto} onSubmit={() => {}}>
        {props => <EtoRegistrationCompanyInformationComponent {...props} {...loadingState} />}
      </Formik>
    </Provider>
  ))
  .add("EtoRegistrationMedia", () => (
    <Provider store={createStore(() => ({}))}>
      <Formik initialValues={eto} onSubmit={() => {}}>
        {props => <EtoRegistrationMediaComponent {...props} {...loadingState} />}
      </Formik>
    </Provider>
  ))
  .add("EtoRegistrationPitch", () => (
    <Provider store={createStore(() => ({}))}>
      <Formik initialValues={eto} onSubmit={() => {}}>
        {props => <EtoRegistrationPitchComponent {...props} {...loadingState} />}
      </Formik>
    </Provider>
  ))
  .add("EtoRegistrationTerms", () => (
    <Provider store={createStore(() => ({}))}>
      <Formik initialValues={eto} onSubmit={() => {}}>
        {props => <EtoRegistrationTermsComponent {...props} {...loadingState} />}
      </Formik>
    </Provider>
  ))
  .add("EtoVotingRights", () => (
    <Provider store={createStore(() => ({}))}>
      <Formik initialValues={eto} onSubmit={() => {}}>
        {props => <EtoVotingRightsComponent {...props} {...loadingState} />}
      </Formik>
    </Provider>
  ))
  .add("EtoInvestmentTerms", () => (
    <Provider store={createStore(() => ({}))}>
      <Formik initialValues={eto} onSubmit={() => {}}>
        {props => <EtoInvestmentTermsComponent {...props} {...loadingState} />}
      </Formik>
    </Provider>
  ))
  .add("EtoRegistrationKeyIndividuals", () => (
    <Provider store={createStore(() => ({}))}>
      <Formik
        initialValues={eto}
        onSubmit={() => {}}
        validationSchema={() => EtoKeyIndividualsType.toYup()}
      >
        {props => <EtoRegistrationKeyIndividualsComponent {...props} {...loadingState} />}
      </Formik>
    </Provider>
  ))
  .add("EtoRegistrationLegalInformation", () => (
    <Provider store={createStore(() => ({}))}>
      <Formik initialValues={eto} onSubmit={() => {}}>
        {props => <EtoRegistrationLegalInformationComponent {...props} {...loadingState} />}
      </Formik>
    </Provider>
  ))
  .add("EtoRegistrationRiskAssessment", () => (
    <Provider store={createStore(() => ({}))}>
      <Formik initialValues={eto} onSubmit={() => {}}>
        {props => <EtoRegistrationRiskAssessmentComponent {...props} {...loadingState} />}
      </Formik>
    </Provider>
  ));
