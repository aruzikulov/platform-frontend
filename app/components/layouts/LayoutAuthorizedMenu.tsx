import * as cn from "classnames";
import * as H from "history";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { match } from "react-router";
import { NavLink } from "react-router-dom";
import { compose, withHandlers } from "recompose";

import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { selectIsVerifiedInvestor, selectUserType } from "../../modules/auth/selectors";
import { selectShouldEtoDataLoad } from "../../modules/eto-flow/selectors";
import { selectGenericModalIsOpen } from "../../modules/generic-modal/reducer";
import { selectIsActionRequiredSettings } from "../../modules/notifications/selectors";
import { appConnect } from "../../store";
import { TTranslatedString } from "../../types";
import { invariant } from "../../utils/invariant";
import { appRoutes } from "../appRoutes";
import { externalRoutes } from "../externalRoutes";
import { IdentityModal } from "../identity/IdentityModal";
import { Button, EButtonLayout } from "../shared/buttons";
import { InlineIcon } from "../shared/InlineIcon";

import * as iconDashboard from "../../assets/img/inline_icons/icon-menu-dashboard.svg";
import * as iconDocuments from "../../assets/img/inline_icons/icon-menu-documents.svg";
import * as iconEto from "../../assets/img/inline_icons/icon-menu-eto.svg";
import * as iconFingerprint from "../../assets/img/inline_icons/icon-menu-fingerprint.svg";
import * as iconHelp from "../../assets/img/inline_icons/icon-menu-help.svg";
import * as iconPortfolio from "../../assets/img/inline_icons/icon-menu-portfolio.svg";
import * as iconSettings from "../../assets/img/inline_icons/icon-menu-settings.svg";
import * as iconWallet from "../../assets/img/inline_icons/icon-menu-wallet.svg";

import * as styles from "./LayoutAuthorizedMenu.module.scss";

interface IMenuEntry {
  svgString: string;
  menuName: TTranslatedString;
  actionRequired?: boolean;
  disabled?: boolean;
}

interface IMenuEntryLink {
  isActive?: (match: match<any>, location: H.Location) => boolean;
  to: string;
}

interface IMenuEntryButton {
  onClick: () => void;
  isActive: boolean;
}

interface IMenuEntryDisabled {
  svgString: string;
  menuName: string | React.ReactNode;
}

interface IStateProps {
  isVerifiedInvestor: boolean;
  userType?: EUserType;
  actionRequiredSettings: boolean;
  shouldEtoDataLoad: boolean;
  isIdentityModalOpened: boolean;
}

interface IDispatchProps {
  openIdentityModal: () => void;
}

interface IWithProps {
  isLinkActive: (match: match<any>, location: H.Location) => boolean;
}

interface IMenuContent {
  svgString: string;
  menuName: string | React.ReactNode;
  actionRequired?: boolean;
  disabled?: boolean;
}

const MenuEntryContent: React.SFC<IMenuContent> = ({
  actionRequired,
  menuName,
  svgString,
  disabled,
  ...props
}) => {
  return (
    <>
      <span className={disabled ? cn(styles.icon, styles.disabledItem) : styles.icon} {...props}>
        <InlineIcon svgIcon={svgString} />
        {actionRequired && <div className={styles.actionIndicator} />}
      </span>
      <span className={styles.name}>{menuName}</span>
    </>
  );
};

const MenuEntryLink: React.SFC<IMenuEntry & IMenuEntryLink> = ({
  to,
  disabled,
  isActive,
  ...props
}) => {
  const isAbsoluteLink = /^https?:\/\//.test(to);

  return isAbsoluteLink ? (
    <a href={to} target="_blank" className={styles.menuItem}>
      <MenuEntryContent {...props} />
    </a>
  ) : disabled ? (
    <MenuEntryDisabled {...props} />
  ) : (
    <NavLink
      to={to}
      className={styles.menuItem}
      isActive={isActive}
      activeClassName={styles.menuItemActive}
    >
      <MenuEntryContent {...props} />
    </NavLink>
  );
};

const MenuEntryDisabled: React.SFC<IMenuEntryDisabled> = ({ svgString, menuName }) => {
  return (
    <div className={styles.menuItem}>
      <MenuEntryContent menuName={menuName} svgString={svgString} disabled={true} />
    </div>
  );
};

const MenuEntryButton: React.SFC<IMenuEntry & IMenuEntryButton> = ({
  onClick,
  disabled,
  isActive,
  ...props
}) => {
  return disabled ? (
    <MenuEntryDisabled {...props} />
  ) : (
    <Button
      className={cn(styles.menuItem, { [styles.menuItemActive]: isActive })}
      onClick={onClick}
      layout={EButtonLayout.INLINE}
    >
      <MenuEntryContent {...props} />
    </Button>
  );
};

const InvestorMenu: React.SFC<IStateProps & IDispatchProps & IWithProps> = ({
  actionRequiredSettings,
  openIdentityModal,
  isLinkActive,
  isIdentityModalOpened,
  isVerifiedInvestor,
}) => (
  <div className={styles.menu}>
    <div className={styles.menuItems}>
      <MenuEntryLink
        svgString={iconDashboard}
        to={appRoutes.dashboard}
        menuName={<FormattedMessage id="menu.dashboard" />}
        isActive={isLinkActive}
      />
      {process.env.NF_PORTFOLIO_PAGE_VISIBLE === "1" && (
        <MenuEntryLink
          svgString={iconPortfolio}
          to={appRoutes.portfolio}
          menuName={<FormattedMessage id="menu.portfolio" />}
          isActive={isLinkActive}
        />
      )}
      <MenuEntryLink
        svgString={iconWallet}
        to={appRoutes.wallet}
        menuName={<FormattedMessage id="menu.wallet" />}
        data-test-id="authorized-layout-wallet-button"
        isActive={isLinkActive}
      />
      <MenuEntryLink
        svgString={iconHelp}
        to={`${externalRoutes.neufundSupport}/home`}
        menuName={<FormattedMessage id="menu.help" />}
        isActive={isLinkActive}
      />
      <MenuEntryLink
        svgString={iconSettings}
        to={appRoutes.settings}
        menuName={<FormattedMessage id="menu.settings" />}
        actionRequired={actionRequiredSettings}
        data-test-id="authorized-layout-settings-button"
        isActive={isLinkActive}
      />
      <MenuEntryButton
        disabled={!isVerifiedInvestor}
        svgString={iconFingerprint}
        onClick={openIdentityModal}
        menuName={<FormattedMessage id="menu.identity" />}
        data-test-id="authorized-layout-identity-button"
        isActive={isIdentityModalOpened}
      />
    </div>
  </div>
);

const IssuerMenu: React.SFC<{ actionRequiredSettings: boolean; shouldEtoDataLoad: boolean }> = ({
  actionRequiredSettings,
  shouldEtoDataLoad,
}) => (
  <div className={styles.menu}>
    <div className={styles.menuItems}>
      <MenuEntryLink
        svgString={iconDashboard}
        to={appRoutes.dashboard}
        menuName={<FormattedMessage id="menu.dashboard" />}
      />
      <MenuEntryLink
        svgString={iconEto}
        to={appRoutes.etoIssuerView}
        disabled={!shouldEtoDataLoad}
        menuName={<FormattedMessage id="menu.eto-page" />}
      />
      <MenuEntryLink
        svgString={iconDocuments}
        to={appRoutes.documents}
        disabled={!shouldEtoDataLoad}
        menuName={<FormattedMessage id="menu.documents-page" />}
      />
      <MenuEntryLink
        svgString={iconWallet}
        to={appRoutes.wallet}
        menuName={<FormattedMessage id="menu.wallet" />}
        data-test-id="authorized-layout-wallet-button"
      />
      <MenuEntryLink
        svgString={iconHelp}
        to={`${externalRoutes.neufundSupport}/home`}
        menuName={<FormattedMessage id="menu.help" />}
      />
      <MenuEntryLink
        svgString={iconSettings}
        to={appRoutes.settings}
        menuName={<FormattedMessage id="menu.settings" />}
        actionRequired={actionRequiredSettings}
        data-test-id="authorized-layout-settings-button"
      />
    </div>
  </div>
);

export const LayoutAuthorizedMenuComponent: React.SFC<
  IStateProps & IDispatchProps & IWithProps
> = ({ userType, ...props }) => {
  switch (userType) {
    case EUserType.INVESTOR:
      return <InvestorMenu data-test-id="investor-menu" {...props} />;
    case EUserType.ISSUER:
      return <IssuerMenu data-test-id="issuer-menu" {...props} />;
    default:
      return invariant(false, "Unknown user type");
  }
};

export const LayoutAuthorizedMenu = compose<IStateProps & IDispatchProps & IWithProps, {}>(
  appConnect<IStateProps, {}>({
    stateToProps: state => ({
      userType: selectUserType(state.auth),
      actionRequiredSettings: selectIsActionRequiredSettings(state),
      shouldEtoDataLoad: selectShouldEtoDataLoad(state),
      isIdentityModalOpened: selectGenericModalIsOpen(state.genericModal),
      isVerifiedInvestor: selectIsVerifiedInvestor(state),
    }),
    dispatchToProps: dispatch => ({
      openIdentityModal: () => dispatch(actions.genericModal.showModal(IdentityModal)),
    }),
  }),
  withHandlers<IStateProps, IWithProps>({
    isLinkActive: props => match => match && !props.isIdentityModalOpened,
  }),
)(LayoutAuthorizedMenuComponent);
