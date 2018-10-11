import * as Yup from "yup";
import {
  EtoCompanyInformationType,
  EtoEquityTokenInfoType,
  EtoInvestmentTermsType,
  EtoKeyIndividualsType,
  EtoLegalInformationType,
  EtoMediaType,
  EtoPitchType,
  EtoRiskAssessmentType,
  EtoTermsType,
  EtoVotingRightsType,
  GeneralEtoDataType,
} from "../../lib/api/eto/EtoApi.interfaces";

function getErrorsNumber(validator: Yup.Schema<any>, data?: any): number {
  try {
    validator.validateSync(data, { abortEarly: false });
    return 0;
  } catch (e) {
    return e.errors.length;
  }
}

export interface IProgressOptions {
  ignore: any;
}

export type ProgressCalculator = (formState: any, initialData?: any) => number;

// recursivly clones a YUP Schema and makes number and string properties required
function updateValidator(objectSchema: any, ignore: any): any {
  const type = objectSchema._type;
  if (ignore !== true) {
    switch (type) {
      case "object":
        for (const prop in objectSchema.fields) {
          // need to clone before change
          const schema = (objectSchema.fields[prop] = objectSchema.fields[prop].clone());
          updateValidator(schema, ignore && ignore[prop]);
        }
        break;
      case "array":
        // need to clone before change
        objectSchema._subType = objectSchema._subType.clone();
        updateValidator(objectSchema._subType, ignore && ignore[0]);
        break;
      case "string":
      case "number":
        objectSchema.withMutation((schema: any) => schema.required());
    }
  }
}

// recursivly create initial data from current values
function updateInitialData(initialData: any, currentValue: any): any {
  if (Array.isArray(currentValue)) {
    return currentValue.map((_, i) => updateInitialData({}, currentValue[i]));
  } else if (typeof currentValue === "object") {
    for (const prop in currentValue) {
      if (currentValue.hasOwnProperty(prop)) {
        initialData[prop] = updateInitialData({}, currentValue && currentValue[prop]);
      }
    }
    return initialData;
  }
}

export function getInitialDataForFractionCalculation(formState: any): any {
  return updateInitialData({}, formState);
}

export const etoMediaProgressOptions: IProgressOptions = {
  ignore: {
    companyVideo: true,
    companySlideshare: true,
  },
};

export const etoInvestmentTermsProgressOptions: IProgressOptions = {
  ignore: {
    discountScheme: true,
  },
};

export const calculateCompanyInformationProgress = getFormFractionDoneCalculator(
  EtoCompanyInformationType.toYup(),
);
export const calculateEtoTermsProgress = getFormFractionDoneCalculator(EtoTermsType.toYup());
export const calculateEtoKeyIndividualsProgress = getFormFractionDoneCalculator(
  EtoKeyIndividualsType.toYup(),
);
export const calculateLegalInformationProgress = getFormFractionDoneCalculator(
  EtoLegalInformationType.toYup(),
);
export const calculateProductVisionProgress = getFormFractionDoneCalculator(EtoPitchType.toYup());
export const calculateEtoMediaProgress = getFormFractionDoneCalculator(
  EtoMediaType.toYup(),
  etoMediaProgressOptions,
);
export const calculateEtoRiskAssessmentProgress = getFormFractionDoneCalculator(
  EtoRiskAssessmentType.toYup(),
);
export const calculateEtoVotingRightProgress = getFormFractionDoneCalculator(
  EtoVotingRightsType.toYup(),
);
export const calculateEtoEquityTokenInfoProgress = getFormFractionDoneCalculator(
  EtoEquityTokenInfoType.toYup(),
);
export const calculateInvestmentTermsProgress = getFormFractionDoneCalculator(
  EtoInvestmentTermsType.toYup(),
  etoInvestmentTermsProgressOptions,
);

export const calculateGeneralEtoData = getFormFractionDoneCalculator(GeneralEtoDataType.toYup(), {
  ignore: true,
});

export function getFormFractionDoneCalculator(
  validator: Yup.Schema<any>,
  opts?: IProgressOptions,
): ProgressCalculator {
  const strictValidator = validator.clone();
  const ignore = opts && opts.ignore;
  updateValidator(strictValidator, ignore);

  return (formState: any, initialData?: any) => {
    if (typeof initialData === "undefined") {
      initialData = updateInitialData({}, formState);
    }

    const errors = getErrorsNumber(strictValidator, formState) || 0;
    const maxErrors = getErrorsNumber(strictValidator, initialData) || 1;

    const result = 1 - errors / maxErrors;
    if (result < 0) return 0;
    return result;
  };
}
