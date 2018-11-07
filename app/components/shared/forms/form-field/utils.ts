import { FormikErrors, FormikTouched } from "formik";
import { get, isFunction } from "lodash";
import { InputProps } from "reactstrap";

import { getFieldSchema, isRequired } from "../../../../utils/yupUtils";

/* The function that encapsulates the logic of determining a value for Input field valid property. Note we have to
   return boolean | undefined value. Undefined should be returned when the field has not been touched by the user. */
export const isValid = (
  touched: FormikTouched<any>,
  errors: FormikErrors<any>,
  key: string,
  ignoreTouched?: boolean,
): boolean | undefined => {
  if (ignoreTouched) return !get(errors, key);

  if (get(touched, key)) {
    return !(errors && get(errors, key));
  }

  return undefined;
};

export const isNonValid = (
  touched: FormikTouched<any>,
  errors: FormikErrors<any>,
  name: string,
  ignoreTouched?: boolean,
): boolean => {
  const valid = isValid(touched, errors, name, ignoreTouched);

  return !(valid === undefined || valid === true);
};

export const computedValue = (val: InputProps["value"] = "", limit: number | undefined) => {
  if (typeof val === "number" || Array.isArray(val) || !limit) {
    return val;
  }

  return limit && val.length > limit ? val.slice(0, limit - 1) : val;
};

export const countedCharacters = (val: InputProps["value"] = "", limit: number) => {
  if (typeof val !== "string") {
    throw new Error("Only strings are supported for character counters");
  }

  return `${val.length}/${limit}`;
};

export const isFieldRequired = (validationSchema: any, name: string) => {
  if (validationSchema) {
    const schema = isFunction(validationSchema) ? validationSchema() : validationSchema;
    const fieldSchema = getFieldSchema(name, schema);
    return isRequired(fieldSchema);
  } else {
    return false;
  }
};
