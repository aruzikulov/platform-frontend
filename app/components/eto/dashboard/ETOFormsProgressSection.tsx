import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";

import { EtoState } from "../../../lib/api/eto/EtoApi.interfaces";
import { etoFormIsReadonly } from "../../../lib/api/eto/EtoApiUtils";
import {
  selectIsGeneralEtoLoading,
  selectIssuerCompany,
  selectIssuerEto,
  selectIssuerEtoState,
  selectShouldEtoDataLoad,
} from "../../../modules/eto-flow/selectors";
import { EEtoFormTypes } from "../../../modules/eto-flow/types";
import {
  calculateCompanyInformationProgress,
  calculateEtoEquityTokenInfoProgress,
  calculateEtoKeyIndividualsProgress,
  calculateEtoMediaProgress,
  calculateEtoRiskAssessmentProgress,
  calculateEtoTermsProgress,
  calculateEtoVotingRightsProgress,
  calculateInvestmentTermsProgress,
  calculateLegalInformationProgress,
  calculateProductVisionProgress,
} from "../../../modules/eto-flow/utils";
import { appConnect } from "../../../store";
import { EtoFormProgressWidget } from "../../shared/EtoFormProgressWidget";
import { etoRegisterRoutes } from "../registration/routes";

interface IEtoRegisteredRoutes {
  [id: string]: EEtoFormTypes;
}

export interface IStateProps {
  etoStatus?: EtoState;
  loadingData: boolean;
  shouldEtoDataLoad: boolean;
  companyInformationProgress: number;
  legalInformationProgress: number;
  etoTermsProgress: number;
  etoKeyIndividualsProgress: number;
  productVisionProgress: number;
  etoMediaProgress: number;
  etoRiskAssessmentProgress: number;
  etoEquityTokenInfoProgress: number;
  etoVotingRightsProgress: number;
  etoInvestmentTermsProgress: number;
}

const ETOFormsProgressSectionComponent: React.SFC<IStateProps> = ({
  etoStatus,
  loadingData,
  shouldEtoDataLoad,
  companyInformationProgress,
  legalInformationProgress,
  etoTermsProgress,
  etoKeyIndividualsProgress,
  productVisionProgress,
  etoMediaProgress,
  etoRiskAssessmentProgress,
  etoEquityTokenInfoProgress,
  etoVotingRightsProgress,
  etoInvestmentTermsProgress,
}) => {
  const sections = [
    {
      id: EEtoFormTypes.CompanyInformation,
      progress: companyInformationProgress,
      name: <FormattedMessage id="eto.form-progress-widget.about" />,
      testingId: "eto-progress-widget-about",
      readonly: false,
    },
    {
      id: EEtoFormTypes.LegalInformation,
      progress: legalInformationProgress,
      name: <FormattedMessage id="eto.form-progress-widget.legal-info" />,
      testingId: "eto-progress-widget-legal-info",
    },
    {
      id: EEtoFormTypes.EtoInvestmentTerms,
      progress: etoInvestmentTermsProgress,
      name: <FormattedMessage id="eto.form-progress-widget.investment-terms" />,
      testingId: "eto-progress-widget-investment-terms",
    },
    {
      id: EEtoFormTypes.EtoTerms,
      progress: etoTermsProgress,
      name: <FormattedMessage id="eto.form-progress-widget.eto-terms" />,
      testingId: "eto-progress-widget-eto-terms",
    },
    {
      id: EEtoFormTypes.KeyIndividuals,
      progress: etoKeyIndividualsProgress,
      name: <FormattedMessage id="eto.form-progress-widget.key-individuals" />,
      testingId: "eto-progress-widget-key-individuals",
    },
    {
      id: EEtoFormTypes.ProductVision,
      progress: productVisionProgress,
      name: <FormattedMessage id="eto.form-progress-widget.product-vision" />,
      testingId: "eto-progress-widget-product-vision",
    },
    {
      id: EEtoFormTypes.EtoMedia,
      progress: etoMediaProgress,
      name: <FormattedMessage id="eto.form-progress-widget.media" />,
      testingId: "eto-progress-widget-media",
    },
    {
      id: EEtoFormTypes.EtoRiskAssessment,
      progress: etoRiskAssessmentProgress,
      name: <FormattedMessage id="eto.form-progress-widget.risk-assessment" />,
      testingId: "eto-progress-widget-risk-assessment",
    },
    {
      id: EEtoFormTypes.EtoEquityTokenInfo,
      progress: etoEquityTokenInfoProgress,
      name: <FormattedMessage id="eto.form-progress-widget.equity-token-info" />,
      testingId: "eto-progress-widget-equity-token-info",
    },
    {
      id: EEtoFormTypes.EtoVotingRights,
      progress: etoVotingRightsProgress,
      name: <FormattedMessage id="eto.form-progress-widget.voting-right" />,
      testingId: "eto-progress-widget-voting-right",
    },
  ];

  return (
    <>
      {sections.map((section, index) => (
        <Col key={index} lg={4} xs={12} md={6} className="mb-4" data-test-id={section.testingId}>
          <EtoFormProgressWidget
            isLoading={loadingData}
            to={(etoRegisterRoutes as IEtoRegisteredRoutes)[section.id]}
            progress={shouldEtoDataLoad ? section.progress : 0}
            disabled={!shouldEtoDataLoad}
            name={section.name}
            readonly={etoFormIsReadonly(section.id, etoStatus)}
          />
        </Col>
      ))}
    </>
  );
};

export const ETOFormsProgressSection = appConnect<IStateProps, {}>({
  stateToProps: state => ({
    etoStatus: selectIssuerEtoState(state),
    loadingData: selectIsGeneralEtoLoading(state),
    shouldEtoDataLoad: selectShouldEtoDataLoad(state),
    companyInformationProgress: calculateCompanyInformationProgress(selectIssuerCompany(state)),
    etoTermsProgress: calculateEtoTermsProgress(selectIssuerEto(state)),
    etoKeyIndividualsProgress: calculateEtoKeyIndividualsProgress(selectIssuerCompany(state)),
    legalInformationProgress: calculateLegalInformationProgress(selectIssuerCompany(state)),
    productVisionProgress: calculateProductVisionProgress(selectIssuerCompany(state)),
    etoMediaProgress: calculateEtoMediaProgress(selectIssuerCompany(state)),
    etoVotingRightsProgress: calculateEtoVotingRightsProgress(selectIssuerEto(state)),
    etoEquityTokenInfoProgress: calculateEtoEquityTokenInfoProgress(selectIssuerEto(state)),
    etoRiskAssessmentProgress: calculateEtoRiskAssessmentProgress(selectIssuerCompany(state)),
    etoInvestmentTermsProgress: calculateInvestmentTermsProgress(selectIssuerEto(state)),
  }),
})(ETOFormsProgressSectionComponent);
