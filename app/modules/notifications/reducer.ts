import { AppActionTypes, AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { routingActions } from "../routing/actions";
import { notificationActions } from "./actions";

export enum NotificationType {
  INFO = "info",
  WARNING = "warning",
}

export interface INotification {
  id: number;
  type: NotificationType;
  text: string;
  onClickAction: AppActionTypes;
  actionLinkText?: string;
  clickable?: boolean;
}

export interface INotificationsState {
  notifications: Array<INotification>;
}

export const notificationsInitState: INotificationsState = {
  notifications: [],
};

export const notificationsReducer: AppReducer<INotificationsState> = (
  state = notificationsInitState,
  action,
): DeepReadonly<INotificationsState> => {
  switch (action.type) {
    case "NOTIFICATIONS_ADD": {
      const pNotification = action.payload.notification;

      const newState = {
        notifications: Array.from(state.notifications),
      };

      const id = pNotification.id ? pNotification.id : Date.now();

      newState.notifications.push({
        id: id,
        type: pNotification.type,
        actionLinkText: pNotification.actionLinkText,
        text: pNotification.text,
        onClickAction: pNotification.onClickAction
          ? pNotification.onClickAction
          : notificationActions.notificationRemove(id),
      });
      return newState;
    }
    case "NOTIFICATIONS_REMOVE":
      const notificationsFiltered = state.notifications.filter(
        notification => notification.id !== action.payload.id,
      );
      return {
        ...state,
        notifications: notificationsFiltered,
      };
  }
  return state;
};

export const settingsNotification = () => ({
  id: Date.now(),
  type: NotificationType.WARNING,
  text: "Please update your account before proceeding. Head to Settings now. ",
  actionLinkText: "Go to settings",
  onClickAction: routingActions.goToSettings(),
});

export const settingsNotificationInvestor = () => ({
  id: Date.now(),
  type: NotificationType.WARNING,
  text: "You will not be able to INVEST until you complete required steps in Settings.",
  actionLinkText: "Go to settings",
  onClickAction: routingActions.goToSettings(),
  clickable: true,
});

//TODO: Add Translation
