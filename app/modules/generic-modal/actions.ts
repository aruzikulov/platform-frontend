import { createAction, createSimpleAction } from "../actionsUtils";
import { TIconType } from "./reducer";

// TODO: Refactor actions to receive single object as a parameter
export const genericModalActions = {
  showModal: (component: React.ReactType) => createAction("MODAL_SHOW", { component }),

  showGenericModal: (
    title: string | React.ReactNode,
    description?: string | React.ReactNode,
    icon?: TIconType,
    actionLinkText?: string | React.ReactNode,
    // TODO: find circular dependency in AppActionTypes
    onClickAction?: any,
  ) =>
    createAction("GENERIC_MODAL_SHOW", { title, description, icon, actionLinkText, onClickAction }),

  showInfoModal: (
    title: string | React.ReactNode,
    description?: string | React.ReactNode,
    actionLinkText?: string | React.ReactNode,
    onClickAction?: any,
  ) =>
    genericModalActions.showGenericModal(
      title,
      description,
      "check",
      actionLinkText,
      onClickAction,
    ),

  showErrorModal: (
    title: string | React.ReactNode,
    description?: string | React.ReactNode,
    actionLinkText?: string | React.ReactNode,
    onClickAction?: any,
  ) =>
    genericModalActions.showGenericModal(
      title,
      description,
      "exclamation",
      actionLinkText,
      onClickAction,
    ),

  hideGenericModal: () => createSimpleAction("GENERIC_MODAL_HIDE"),
};
