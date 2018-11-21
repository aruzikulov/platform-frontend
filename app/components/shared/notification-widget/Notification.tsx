import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { branch } from "recompose";

import { NotificationText, NotificationType } from "../../../modules/notifications/reducer";
import { withContainer } from "../../../utils/withContainer";
import { Button, ButtonClose, ButtonTextPosition, ButtonWidth, EButtonLayout } from "../buttons";

import * as infoIcon from "../../../assets/img/notifications/info.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./Notification.module.scss";

export interface INotificationProps {
  type: NotificationType;
  text: NotificationText;
  actionLinkText?: string;
  onClick: () => void;
  clickable?: boolean;
}

const { INFO, WARNING } = NotificationType;

const {
  COMPLETE_REQUEST_NOTIFICATION,
  COMPLETE_UPDATE_ACCOUNT,
  TEST_NOTIFICATION,
} = NotificationText;

const icons = {
  [INFO]: infoIcon,
  [WARNING]: warningIcon,
};

const notificationTexts = {
  [COMPLETE_REQUEST_NOTIFICATION]: <FormattedMessage id="notifications.complete-request" />,
  [COMPLETE_UPDATE_ACCOUNT]: <FormattedMessage id="notifications.update-account" />,
  [TEST_NOTIFICATION]: "bla",
};

const NotificationClickableContainer: React.SFC<INotificationProps> = ({ children, onClick }) => (
  <Button
    layout={EButtonLayout.SIMPLE}
    width={ButtonWidth.BLOCK}
    textPosition={ButtonTextPosition.LEFT}
    onClick={onClick}
  >
    {children}
  </Button>
);

const NotificationComponent: React.SFC<INotificationProps> = ({
  type,
  text,
  onClick,
  actionLinkText,
}) => (
  <div data-test-id="notification" className={cn(styles.notification, type)}>
    <i className={`${styles.iconNotificationType}`}>
      <img src={icons[type]} />
    </i>
    <span data-test-id="notification-text" className={styles.text}>
      {notificationTexts[text]}
    </span>
    {actionLinkText ? (
      <Button
        layout={EButtonLayout.INLINE}
        theme={"white"}
        data-test-id="notification-close"
        className={styles.link}
        onClick={onClick}
      >
        {actionLinkText}
      </Button>
    ) : (
      <i className={styles.close} data-test-id="notification-close" onClick={onClick}>
        <ButtonClose />
      </i>
    )}
  </div>
);

const Notification = branch<INotificationProps>(
  ({ clickable }) => clickable === true,
  withContainer(NotificationClickableContainer),
)(NotificationComponent);

export { Notification, NotificationComponent };
