import { genericModalIcons } from "../../components/modals/GenericModal";
import { AppActionTypes, AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IGenericModalState {
  isOpen: boolean;
  genericModalObj?: IGenericModal;
}

//Add more custom icons here
export type TIconType = keyof typeof genericModalIcons;

export interface IGenericModal {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: TIconType;
  actionLinkText?: string | React.ReactNode;
  onClickAction?: AppActionTypes;
}

const initialState: IGenericModalState = {
  isOpen: false,
};

export const genericModalReducer: AppReducer<IGenericModalState> = (
  state = initialState,
  action,
): DeepReadonly<IGenericModalState> => {
  switch (action.type) {
    case "GENERIC_MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
        genericModalObj: action.payload,
      };
    case "GENERIC_MODAL_HIDE":
      return initialState;
  }

  return state;
};

export const selectGenericModalIsOpen = (state: IGenericModalState): boolean => state.isOpen;
export const selectGenericModalObj = (state: IGenericModalState): IGenericModal | undefined =>
  state.genericModalObj;
