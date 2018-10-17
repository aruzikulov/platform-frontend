import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { TKycRequestType, TRequestStatus } from "../../lib/api/KycApi.interfaces";
import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { selectUserType } from "../../modules/auth/selectors";
import { selectKycRequestStatus, selectKycRequestType } from "../../modules/kyc/selectors";
import {
  selectIcbmWalletConnected,
  selectLockedWalletConnected,
} from "../../modules/wallet/selectors";
import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { DashboardSection } from "../eto/shared/DashboardSection";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SectionHeader } from "../shared/SectionHeader";
import { ChangeEmail } from "./change-email/ChangeEmail";
import { YourEthereumAddressWidget } from "./ethereum-address-widget/YourEthereumAddressWidget";
import { CheckYourICBMWalletWidget } from "./icbm-wallet-widget/CheckYourICBMWalletWidget";
import { PersonalAccountDetails } from "./personal-account-details/PersonalAccountDetails";
import { SettingsWidgets } from "./SettingsWidgets";

interface IStateProps {
  isLightWallet: boolean;
  isIcbmWalletConnected: boolean;
  isLockedWalletConnected: boolean;
  userType?: EUserType;
  kycRequestType?: TKycRequestType;
  kycRequestStatus?: TRequestStatus;
}

export const SettingsComponent: React.SFC<IStateProps> = ({
  isLightWallet,
  isIcbmWalletConnected,
  isLockedWalletConnected,
  userType,
  kycRequestType,
  kycRequestStatus,
}) => {
  const isPersonalDataProcessed = kycRequestStatus !== "Draft";
  const isUserInvestor = userType === EUserType.INVESTOR;
  const isIndividual = kycRequestType === "individual";

  return (
    <LayoutAuthorized>
      <Row className="row-gutter-top">
        <DashboardSection
          title={<FormattedMessage id="settings.security-settings.title" />}
          data-test-id="eto-dashboard-application"
        />
        <SettingsWidgets isDynamic={false} isLightWallet={isLightWallet} />

        <DashboardSection
          title={<FormattedMessage id="settings.account-info.title" />}
          data-test-id="eto-dashboard-application"
        />

        <Col lg={4} xs={12}>
          <YourEthereumAddressWidget />
        </Col>
        {process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED === "1" &&
          !isIcbmWalletConnected &&
          !isLockedWalletConnected &&
          isUserInvestor && (
            <Col lg={4} xs={12}>
              <CheckYourICBMWalletWidget />
            </Col>
          )}

        {isUserInvestor &&
          isIndividual &&
          isPersonalDataProcessed && (
            <Col lg={4} xs={12}>
              <PersonalAccountDetails />
            </Col>
          )}

        {process.env.NF_FEATURE_EMAIL_CHANGE_ENABLED === "1" && (
          <>
            {/* TODO: Remove message */}
            <Col xs={12}>
              <SectionHeader>
                <FormattedMessage id="settings.personal-settings.title" />
              </SectionHeader>
            </Col>
            <Col lg={8} xs={12}>
              <ChangeEmail />
            </Col>
          </>
        )}
      </Row>
    </LayoutAuthorized>
  );
};

export const Settings = compose<React.SFC>(
  onEnterAction({ actionCreator: d => d(actions.wallet.loadWalletData()) }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      isLightWallet: selectIsLightWallet(s.web3),
      userType: selectUserType(s.auth),
      kycRequestStatus: selectKycRequestStatus(s.kyc),
      kycRequestType: selectKycRequestType(s.kyc),
      isIcbmWalletConnected: selectIcbmWalletConnected(s.wallet),
      isLockedWalletConnected: selectLockedWalletConnected(s.wallet),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadIndividualData());
    },
  }),
)(SettingsComponent);
