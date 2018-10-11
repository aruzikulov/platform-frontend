import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { NavLink, NavLinkProps } from "react-router-dom";

import { EUserType } from "../../lib/api/users/interfaces";
import { selectUserType } from "../../modules/auth/selectors";
import { selectIsActionRequiredSettings } from "../../modules/notifications/selectors";
import { appConnect } from "../../store";
import { invariant } from "../../utils/invariant";
import { appRoutes } from "../appRoutes";
import { InlineIcon } from "../shared/InlineIcon";

import * as cn from "classnames";
import * as iconDashboard from "../../assets/img/inline_icons/icon-menu-dashboard.svg";
import * as iconDocuments from "../../assets/img/inline_icons/icon-menu-documents.svg";
import * as iconEto from "../../assets/img/inline_icons/icon-menu-eto.svg";
import * as iconHelp from "../../assets/img/inline_icons/icon-menu-help.svg";
import * as iconPortfolio from "../../assets/img/inline_icons/icon-menu-portfolio.svg";
import * as iconSettings from "../../assets/img/inline_icons/icon-menu-settings.svg";
import * as iconWallet from "../../assets/img/inline_icons/icon-menu-wallet.svg";
import { selectShouldEtoDataLoad } from "../../modules/eto-flow/selectors";
import { externalRoutes } from "../externalRoutes";
import * as styles from "./LayoutAuthorizedMenu.module.scss";

interface IMenuEntry {
  svgString: string;
  menuName: string | React.ReactNode;
  actionRequired?: boolean;
  to: string;
  disabled?: boolean;
}

interface IStateProps {
  userType?: EUserType;
  actionRequiredSettings: boolean;
  shouldEtoDataLoad: boolean;
}

const MenuEntryContent: React.SFC<IMenuEntry & NavLinkProps> = ({
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

const MenuEntry: React.SFC<IMenuEntry & NavLinkProps> = ({ to, svgString, disabled, ...props }) => {
  const isAbsoluteLink = /^https?:\/\//.test(to);

  return isAbsoluteLink ? (
    <a href={to} target="_blank" className={styles.menuItem}>
      <MenuEntryContent {...props} to={to} svgString={svgString} />
    </a>
  ) : disabled ? (
    <div className={styles.menuItem}>
      <MenuEntryContent {...props} to={to} svgString={svgString} disabled={disabled} />
    </div>
  ) : (
    <NavLink to={to} className={styles.menuItem}>
      <MenuEntryContent {...props} to={to} svgString={svgString} />
    </NavLink>
  );
};

const InvestorMenu: React.SFC<{ actionRequiredSettings: boolean }> = ({
  actionRequiredSettings,
}) => (
  <div className={styles.menu}>
    <div className={styles.menuItems}>
      <MenuEntry
        svgString={iconDashboard}
        to={appRoutes.dashboard}
        menuName={<FormattedMessage id="menu.dashboard" />}
      />
      {process.env.NF_PORTFOLIO_PAGE_VISIBLE === "1" && (
        <MenuEntry
          svgString={iconPortfolio}
          to={appRoutes.portfolio}
          menuName={<FormattedMessage id="menu.portfolio" />}
        />
      )}
      <MenuEntry
        svgString={iconWallet}
        to={appRoutes.wallet}
        menuName={<FormattedMessage id="menu.wallet" />}
        data-test-id="authorized-layout-wallet-button"
      />
      <MenuEntry
        svgString={iconHelp}
        to={externalRoutes.freshdesk}
        menuName={<FormattedMessage id="menu.help" />}
        target="_blank"
      />
      <MenuEntry
        svgString={iconSettings}
        to={appRoutes.settings}
        menuName={<FormattedMessage id="menu.settings" />}
        actionRequired={actionRequiredSettings}
        data-test-id="authorized-layout-settings-button"
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
      <MenuEntry
        svgString={iconDashboard}
        to={appRoutes.dashboard}
        menuName={<FormattedMessage id="menu.dashboard" />}
      />
      <MenuEntry
        svgString={iconEto}
        to={appRoutes.etoIssuerView}
        disabled={!shouldEtoDataLoad}
        menuName={<FormattedMessage id="menu.eto-page" />}
      />
      <MenuEntry
        svgString={iconDocuments}
        to={appRoutes.documents}
        disabled={!shouldEtoDataLoad}
        menuName={<FormattedMessage id="menu.documents-page" />}
      />
      <MenuEntry
        svgString={iconHelp}
        to="https://support.neufund.org/support/home"
        menuName={<FormattedMessage id="menu.help" />}
        target="_blank"
      />
      <MenuEntry
        svgString={iconSettings}
        to={appRoutes.settings}
        menuName={<FormattedMessage id="menu.settings" />}
        actionRequired={actionRequiredSettings}
        data-test-id="authorized-layout-settings-button"
      />
    </div>
  </div>
);

export const LayoutAuthorizedMenuComponent: React.SFC<IStateProps> = ({ userType, ...props }) => {
  switch (userType) {
    case EUserType.INVESTOR:
      return <InvestorMenu data-test-id="investor-menu" {...props} />;
    case EUserType.ISSUER:
      return <IssuerMenu data-test-id="issuer-menu" {...props} />;
    default:
      return invariant(false, "Unknown user type");
  }
};

export const LayoutAuthorizedMenu = appConnect<IStateProps, {}>({
  stateToProps: s => ({
    userType: selectUserType(s.auth),
    actionRequiredSettings: selectIsActionRequiredSettings(s),
    shouldEtoDataLoad: selectShouldEtoDataLoad(s),
  }),
})(LayoutAuthorizedMenuComponent);
