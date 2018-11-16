import { EEtoFormTypes } from "../../../modules/eto-flow/types";
import { EtoState } from "./EtoApi.interfaces";

export const etoFormIsReadonly = (formName: EEtoFormTypes, etoState?: EtoState) => {
  const readOnlyForms = [
    EEtoFormTypes.EtoEquityTokenInfo,
    EEtoFormTypes.EtoTerms,
    EEtoFormTypes.EtoVotingRights,
    EEtoFormTypes.EtoInvestmentTerms,
  ];
  return etoState !== EtoState.PREVIEW && readOnlyForms.includes(formName);
};

const findSchemaConstraint = (schema: any, constraintName: string) => {
  const schemaTest = schema.tests.find((test: any) => test.TEST_NAME === constraintName);
  return schemaTest.TEST.params[constraintName];
};

export const findMin = (schema: any) => {
  return findSchemaConstraint(schema, "min");
};

export const findMax = (schema: any) => {
  return findSchemaConstraint(schema, "max");
};
