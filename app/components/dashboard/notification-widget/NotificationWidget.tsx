import * as React from "react";

import { compact } from "lodash";
import { INotification } from "../../../modules/notifications/reducer";
import { selectSettingsNotification } from "../../../modules/notifications/selectors";
import { appConnect, AppDispatch } from "../../../store";
import { Notification } from "./Notification";

import * as styles from "./Notification.module.scss";

interface IStateProps {
  notifications: INotification[];
}

interface IDispatchProps {
  dispatch: AppDispatch;
}

type IProps = IStateProps & IDispatchProps;

const NotificationWidgetComponent: React.SFC<IProps> = ({ notifications, dispatch }) => {
  return (
    <div className={styles.widget}>
      {notifications.map((notification, index) => (
        <Notification
          key={notification.text + index.toString(10)}
          type={notification.type}
          text={notification.text}
          actionLinkText={notification.actionLinkText}
          onClick={() => dispatch(notification.onClickAction)}
          clickable={notification.clickable}
        />
      ))}
    </div>
  );
};

export const NotificationWidget = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => {
    const notifications = s.notifications.notifications;
    const appStateDerivedNotifications = compact([selectSettingsNotification(s)]);
    return {
      notifications: [...notifications, ...appStateDerivedNotifications],
    };
  },
  dispatchToProps: dispatch => ({
    dispatch,
  }),
})(NotificationWidgetComponent);
