import { AppActionTypes } from "../../store";
import { createAction } from "../actionsUtils";
import { NotificationText, NotificationType } from "./reducer";

export interface INewNotification {
  id?: number;
  type: NotificationType;
  text: NotificationText;
  actionLinkText?: string;
  onClickAction?: AppActionTypes;
}

export const notificationActions = {
  notificationAdd: (notification: INewNotification) =>
    createAction("NOTIFICATIONS_ADD", { notification }),

  notificationRemove: (id: number) => createAction("NOTIFICATIONS_REMOVE", { id }),
};
