import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { TRequestOutsourcedStatus, TRequestStatus } from "../../../lib/api/KycApi.interfaces";
import { EUserType } from "../../../lib/api/users/interfaces";
import { actions } from "../../../modules/actions";
import {
  selectBackupCodesVerified,
  selectIsUserEmailVerified,
  selectUserType,
} from "../../../modules/auth/selectors";
import {
  selectExternalKycUrl,
  selectKycRequestOutsourcedStatus,
  selectKycRequestStatus,
  selectWidgetError,
  selectWidgetLoading,
} from "../../../modules/kyc/selectors";
import { selectIsLightWallet } from "../../../modules/web3/selectors";
import { appConnect } from "../../../store";
import { UnionDictionary } from "../../../types";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { onLeaveAction } from "../../../utils/OnLeaveAction";
import { externalRoutes } from "../../externalRoutes";
import { Button, EButtonLayout } from "../../shared/buttons";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { Panel } from "../../shared/Panel";
import { WarningAlert } from "../../shared/WarningAlert";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as successIcon from "../../../assets/img/notifications/Success_small.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./KycStatusWidget.module.scss";

interface IStateProps {
  requestStatus?: TRequestStatus;
  requestOutsourcedStatus?: TRequestOutsourcedStatus;
  isUserEmailVerified: boolean;
  isLoading: boolean;
  backupCodesVerified: boolean;
  error?: string;
  externalKycUrl?: string;
  userType: EUserType;
}

interface IOwnProps {
  step: number;
}

interface IDispatchProps {
  onGoToKycHome: () => void;
  onGoToDashboard: () => void;
}

export type IKycStatusWidgetProps = IStateProps & IDispatchProps & IOwnProps;

const statusTextMap: UnionDictionary<TRequestStatus, React.ReactNode> = {
  Accepted: <FormattedMessage id="settings.kyc-status-widget.status.accepted" />,
  Rejected: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.rejected"
      values={{ url: `${externalRoutes.neufundSupport}/home` }}
    />
  ),
  Ignored: <FormattedMessage id="settings.kyc-status-widget.status.ignored" />,
  Pending: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.pending"
      values={{ url: `${externalRoutes.neufundSupport}/home` }}
    />
  ),
  Draft: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.draft"
      values={{ url: `${externalRoutes.neufundSupport}/home` }}
    />
  ),
  Outsourced: <FormattedMessage id="settings.kyc-status-widget.status.outsourced" />,
};

const outsourcedStatusTextMap: UnionDictionary<TRequestOutsourcedStatus, React.ReactNode> = {
  review_pending: (
    <FormattedMessage id="settings.kyc-status-widget.status.outsourced.review_pending" />
  ),
  aborted: (
    <FormattedHTMLMessage
      id="settings.kyc-status-widget.status.outsourced.abortedOrCancelled"
      tagName="span"
      values={{ url: `${externalRoutes.neufundSupport}/home` }}
    />
  ),
  canceled: (
    <FormattedHTMLMessage
      id="settings.kyc-status-widget.status.outsourced.abortedOrCancelled"
      tagName="span"
    />
  ),
  other: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.outsourced.other-info"
      values={{ url: `${externalRoutes.neufundSupport}/home` }}
    />
  ),
  started: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.outsourced"
      values={{ url: `${externalRoutes.neufundSupport}/home` }}
    />
  ),
  success: <FormattedMessage id="settings.kyc-status-widget.status.outsourced.review_pending" />,
  success_data_changed: (
    <FormattedMessage id="settings.kyc-status-widget.status.outsourced.review_pending" />
  ),
};

const getStatus = (
  selectIsUserEmailVerified: boolean,
  requestStatus?: TRequestStatus,
  requestOutsourcedStatus?: TRequestOutsourcedStatus,
): React.ReactNode => {
  if (!selectIsUserEmailVerified) {
    return <FormattedMessage id="settings.kyc-status-widget.status.error-verification-email" />;
  }

  if (!requestStatus) {
    return "";
  }

  if (requestStatus === "Outsourced" && requestOutsourcedStatus) {
    return outsourcedStatusTextMap[requestOutsourcedStatus];
  }

  return statusTextMap[requestStatus];
};

const ActionButton = ({
  requestStatus,
  requestOutsourcedStatus,
  onGoToKycHome,
  isUserEmailVerified,
  externalKycUrl,
  userType,
  onGoToDashboard,
  backupCodesVerified,
}: IKycStatusWidgetProps) => {
  if (requestStatus === "Accepted" && userType === EUserType.INVESTOR) {
    return (
      <Button
        layout={EButtonLayout.SECONDARY}
        iconPosition="icon-after"
        svgIcon={arrowRight}
        onClick={onGoToDashboard}
        disabled={!isUserEmailVerified}
      >
        <FormattedMessage id="kyc.request-state.go-to-dashboard" />
      </Button>
    );
  }

  if (requestStatus === "Draft") {
    return (
      <Button
        layout={EButtonLayout.SECONDARY}
        iconPosition="icon-after"
        svgIcon={arrowRight}
        onClick={onGoToKycHome}
        disabled={!isUserEmailVerified || !backupCodesVerified}
      >
        <FormattedMessage id="settings.kyc-status-widget.start-kyc-process" />
      </Button>
    );
  }

  if (requestStatus === "Pending") {
    return (
      <Button
        layout={EButtonLayout.SECONDARY}
        iconPosition="icon-after"
        svgIcon={arrowRight}
        onClick={onGoToKycHome}
        disabled={!isUserEmailVerified}
      >
        <FormattedMessage id="settings.kyc-status-widget.submit-additional-documents" />
      </Button>
    );
  }

  if (
    requestStatus === "Outsourced" &&
    (requestOutsourcedStatus === "canceled" ||
      requestOutsourcedStatus === "aborted" ||
      requestOutsourcedStatus === "started")
  ) {
    return (
      // TODO: Style anchor as button
      <a href={externalKycUrl}>
        <Button layout={EButtonLayout.SECONDARY} iconPosition="icon-after" svgIcon={arrowRight}>
          <FormattedMessage id="settings.kyc-status-widget.continue-external-kyc" />
        </Button>
      </a>
    );
  }

  return <div />;
};

export const KycStatusWidgetComponent: React.SFC<IKycStatusWidgetProps> = props => {
  const {
    requestStatus,
    requestOutsourcedStatus,
    isUserEmailVerified,
    isLoading,
    error,
    step,
  } = props;

  return (
    <Panel
      className="h-100"
      headerText={<FormattedMessage id="settings.kyc-widget.header" values={{ step }} />}
      rightComponent={
        !isLoading &&
        (requestStatus === "Accepted" ? (
          <img src={successIcon} className={styles.icon} aria-hidden="true" />
        ) : (
          <img src={warningIcon} className={styles.icon} aria-hidden="true" />
        ))
      }
    >
      {isLoading ? (
        <div className={styles.panelBody}>
          <Row noGutters>
            <Col>
              <LoadingIndicator className={styles.loading} />
            </Col>
          </Row>
        </div>
      ) : error ? (
        <div className={styles.panelBody}>
          <WarningAlert>
            <FormattedMessage id="settings.kyc-widget.error" />
          </WarningAlert>
        </div>
      ) : (
        <div className={cn(styles.panelBody, "d-flex flex-wrap align-content-around")}>
          <p className={cn(styles.text, "pt-2")}>
            {getStatus(isUserEmailVerified, requestStatus, requestOutsourcedStatus)}
          </p>
          <Col xs={12} className="d-flex justify-content-center">
            <ActionButton {...props} />
          </Col>
        </div>
      )}
    </Panel>
  );
};

export const KycStatusWidget = compose<React.ComponentClass<IOwnProps>>(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: s => ({
      isUserEmailVerified: selectIsUserEmailVerified(s.auth),
      userType: selectUserType(s.auth)!,
      backupCodesVerified: selectBackupCodesVerified(s.auth) || !selectIsLightWallet(s.web3),
      requestStatus: selectKycRequestStatus(s.kyc),
      requestOutsourcedStatus: selectKycRequestOutsourcedStatus(s.kyc),
      externalKycUrl: selectExternalKycUrl(s.kyc),
      isLoading: selectWidgetLoading(s.kyc),
      error: selectWidgetError(s.kyc),
    }),
    dispatchToProps: dispatch => ({
      onGoToKycHome: () => dispatch(actions.routing.goToKYCHome()),
      onGoToDashboard: () => dispatch(actions.routing.goToDashboard()),
    }),
  }),
  // note: initial data for this view are loaded as part of app init process
  onEnterAction({
    actionCreator: d => d(actions.kyc.kycStartWatching()),
  }),
  onLeaveAction({
    actionCreator: d => d(actions.kyc.kycStopWatching()),
  }),
)(KycStatusWidgetComponent);
