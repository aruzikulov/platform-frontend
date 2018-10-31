import { createAction, createSimpleAction } from "../../actionsUtils";
import { IDraftType } from "../interfaces";
import { EValidationState } from "../sender/reducer";

export const txValidatorActions = {
  txSenderValidateDraft: (txDraft: IDraftType) => createAction("TX_SENDER_VALIDATE_DRAFT", txDraft),
  setValidationState: (validationState?: EValidationState) =>
    createAction("TX_SENDER_SET_VALIDATION_STATE", { validationState }),
  clearValidationState: () => createSimpleAction("TX_SENDER_CLEAR_VALIDATION_STATE"),
};
