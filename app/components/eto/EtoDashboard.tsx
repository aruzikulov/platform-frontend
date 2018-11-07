import * as React from "react";
import { FormattedHTMLMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { EtoState } from "../../lib/api/eto/EtoApi.interfaces";
import { TRequestStatus } from "../../lib/api/KycApi.interfaces";
import { actions } from "../../modules/actions";
import {
  selectBackupCodesVerified,
  selectIsUserEmailVerified,
  selectVerifiedUserEmail,
} from "../../modules/auth/selectors";
import {
  selectIsPamphletSubmitted,
  selectIsProspectusSubmitted,
  selectIsTermSheetSubmitted,
} from "../../modules/eto-documents/selectors";
import {
  selectCanEnableBookBuilding,
  selectCombinedEtoCompanyData,
  selectIssuerEtoPreviewCode,
  selectIssuerEtoState,
  selectShouldEtoDataLoad,
} from "../../modules/eto-flow/selectors";
import { calculateGeneralEtoData } from "../../modules/eto-flow/utils";
import { selectKycRequestStatus } from "../../modules/kyc/selectors";
import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SettingsWidgets } from "../settings/SettingsWidgets";
import { EProjecStatusLayout, EProjectStatusSize, ETOState } from "../shared/ETOState";
import { LoadingIndicator } from "../shared/loading-indicator";
import { BookBuildingWidget } from "./dashboard/bookBuildingWidget/BookBuildingWidget";
import { ChoosePreEtoDateWidget } from "./dashboard/choosePreEtoDateWidget/ChoosePreEtoDateWidget";
import { ETOFormsProgressSection } from "./dashboard/ETOFormsProgressSection";
import { SubmitProposalWidget } from "./dashboard/submitProposalWidget/SubmitProposalWidget";
import { UploadPamphletWidget } from "./dashboard/UploadPamphletWidget";
import { UploadProspectusWidget } from "./dashboard/UploadProspectusWidget";
import { UploadTermSheetWidget } from "./dashboard/UploadTermSheetWidget";
import { DashboardSection } from "./shared/DashboardSection";

const SUBMIT_PROPOSAL_THRESHOLD = 1;

interface IStateProps {
  isLightWallet: boolean;
  verifiedEmail?: string;
  backupCodesVerified?: boolean;
  shouldEtoDataLoad?: boolean;
  requestStatus?: TRequestStatus;
  etoState?: EtoState;
  previewCode?: string;
  canEnableBookbuilding: boolean;
  etoFormProgress?: number;
  isTermSheetSubmitted?: boolean;
  isPamphletSubmitted?: boolean;
  isProspectusSubmitted?: boolean;
}

interface IDispatchProps {
  loadFileDataStart: () => void;
}

type IProps = IStateProps & IDispatchProps;

const SubmitDashBoardSection: React.SFC<{ isTermSheetSubmitted?: boolean }> = ({
  isTermSheetSubmitted,
}) => (
  <>
    <DashboardSection
      step={3}
      title="UPLOAD FILES / SUBMIT PROPOSAL"
      data-test-id="eto-dashboard-verification"
    />
    {isTermSheetSubmitted ? (
      <Col lg={4} xs={12}>
        <SubmitProposalWidget />
      </Col>
    ) : (
      <Col lg={4} xs={12}>
        <UploadTermSheetWidget />
      </Col>
    )}
  </>
);

const EtoProgressDashboardSection: React.SFC = () => (
  <>
    <DashboardSection step={2} title="ETO APPLICATION" />
    <Col xs={12}>
      <FormattedHTMLMessage tagName="span" id="eto-dashboard-application-description" />
    </Col>
    <ETOFormsProgressSection />
  </>
);

interface IEtoStateRender {
  etoState?: EtoState;
  shouldViewSubmissionSection?: boolean;
  isTermSheetSubmitted?: boolean;
  isPamphletSubmitted?: boolean;
  isProspectusSubmitted?: boolean;
  canEnableBookbuilding: boolean;
  previewCode?: string;
}

const EtoStateViewRender: React.SFC<IEtoStateRender> = ({
  etoState,
  shouldViewSubmissionSection,
  isTermSheetSubmitted,
  isPamphletSubmitted,
  isProspectusSubmitted,
  canEnableBookbuilding,
  previewCode,
}) => {
  if (!previewCode) {
    return <LoadingIndicator />;
  }

  switch (etoState) {
    case EtoState.PREVIEW:
      return (
        <>
          {shouldViewSubmissionSection && (
            <SubmitDashBoardSection isTermSheetSubmitted={isTermSheetSubmitted} />
          )}
          <EtoProgressDashboardSection />
        </>
      );
    case EtoState.PENDING:
      return (
        <>
          <DashboardSection
            hasDecorator={false}
            title={
              <ETOState
                previewCode={previewCode}
                size={EProjectStatusSize.LARGE}
                layout={EProjecStatusLayout.BLACK}
              />
            }
          />
          <ETOFormsProgressSection />
        </>
      );
    case EtoState.LISTED:
      return (
        <>
          <DashboardSection
            hasDecorator={false}
            title={
              <ETOState
                previewCode={previewCode}
                size={EProjectStatusSize.LARGE}
                layout={EProjecStatusLayout.BLACK}
              />
            }
          />
          {canEnableBookbuilding && (
            <Col lg={4} xs={12}>
              <BookBuildingWidget />
            </Col>
          )}
          {!isPamphletSubmitted && (
            <Col lg={4} xs={12}>
              <UploadProspectusWidget />
            </Col>
          )}
          {!isProspectusSubmitted && (
            <Col lg={4} xs={12}>
              <UploadPamphletWidget />
            </Col>
          )}
          <Col xs={12}>
            <FormattedHTMLMessage tagName="span" id="eto-dashboard-application-description" />
          </Col>
          <ETOFormsProgressSection />
        </>
      );
    case EtoState.PROSPECTUS_APPROVED:
      return (
        <>
          <DashboardSection
            hasDecorator={false}
            title={
              <ETOState
                previewCode={previewCode}
                size={EProjectStatusSize.LARGE}
                layout={EProjecStatusLayout.BLACK}
              />
            }
          />
          {canEnableBookbuilding && (
            <Col lg={4} xs={12}>
              <BookBuildingWidget />
            </Col>
          )}
          <Col xs={12}>
            <FormattedHTMLMessage tagName="span" id="eto-dashboard-application-description" />
          </Col>
          <ETOFormsProgressSection />
        </>
      );
    case EtoState.ON_CHAIN:
      return (
        <>
          <DashboardSection
            hasDecorator={false}
            title={
              <ETOState
                previewCode={previewCode}
                size={EProjectStatusSize.LARGE}
                layout={EProjecStatusLayout.BLACK}
              />
            }
          />
          {canEnableBookbuilding && (
            <Col lg={4} xs={12}>
              <BookBuildingWidget />
            </Col>
          )}
          <Col lg={4} xs={12}>
            <ChoosePreEtoDateWidget />
          </Col>
          <Col xs={12}>
            <FormattedHTMLMessage tagName="span" id="eto-dashboard-application-description" />
          </Col>
          <ETOFormsProgressSection />
        </>
      );
    default:
      return (
        <DashboardSection
          hasDecorator={false}
          title={
            <ETOState
              previewCode={previewCode}
              size={EProjectStatusSize.LARGE}
              layout={EProjecStatusLayout.BLACK}
            />
          }
        />
      );
  }
};

class EtoDashboardComponent extends React.Component<IProps> {
  componentDidMount(): void {
    const { shouldEtoDataLoad, loadFileDataStart } = this.props;

    if (shouldEtoDataLoad) loadFileDataStart();
  }

  render(): React.ReactNode {
    const {
      verifiedEmail,
      backupCodesVerified,
      requestStatus,
      etoState,
      canEnableBookbuilding,
      isLightWallet,
      etoFormProgress,
      isTermSheetSubmitted,
      shouldEtoDataLoad,
      isPamphletSubmitted,
      isProspectusSubmitted,
      previewCode,
    } = this.props;

    const isVerificationSectionDone = !!(
      verifiedEmail &&
      (backupCodesVerified || !isLightWallet) &&
      requestStatus === "Accepted"
    );

    const shouldViewSubmissionSection = !!(
      etoFormProgress && etoFormProgress >= SUBMIT_PROPOSAL_THRESHOLD
    );

    return (
      <LayoutAuthorized>
        <Row className="row-gutter-top" data-test-id="eto-dashboard-application">
          {!isVerificationSectionDone && (
            <>
              <DashboardSection
                step={1}
                title="VERIFICATION"
                data-test-id="eto-dashboard-verification"
              />
              <SettingsWidgets isDynamic={true} {...this.props} />
            </>
          )}

          {shouldEtoDataLoad ? (
            <EtoStateViewRender
              isTermSheetSubmitted={isTermSheetSubmitted}
              isPamphletSubmitted={isPamphletSubmitted}
              isProspectusSubmitted={isProspectusSubmitted}
              shouldViewSubmissionSection={shouldViewSubmissionSection}
              etoState={etoState}
              canEnableBookbuilding={canEnableBookbuilding}
              previewCode={previewCode}
            />
          ) : (
            <EtoProgressDashboardSection />
          )}
        </Row>
      </LayoutAuthorized>
    );
  }
}

export const EtoDashboard = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      kycStatus: selectKycRequestStatus(s.kyc),
      isEmailVerified: selectIsUserEmailVerified(s.auth),
      isLightWallet: selectIsLightWallet(s.web3),
      verifiedEmail: selectVerifiedUserEmail(s.auth),
      backupCodesVerified: selectBackupCodesVerified(s.auth),
      shouldEtoDataLoad: selectShouldEtoDataLoad(s),
      requestStatus: selectKycRequestStatus(s.kyc),
      etoState: selectIssuerEtoState(s),
      previewCode: selectIssuerEtoPreviewCode(s.etoFlow),
      canEnableBookbuilding: selectCanEnableBookBuilding(s),
      isTermSheetSubmitted: selectIsTermSheetSubmitted(s.etoDocuments),
      isPamphletSubmitted: selectIsPamphletSubmitted(s.etoDocuments),
      isProspectusSubmitted: selectIsProspectusSubmitted(s.etoDocuments),
      etoFormProgress: calculateGeneralEtoData(selectCombinedEtoCompanyData(s)),
    }),
    dispatchToProps: dispatch => ({
      loadFileDataStart: () => dispatch(actions.etoDocuments.loadFileDataStart()),
    }),
  }),
)(EtoDashboardComponent);
