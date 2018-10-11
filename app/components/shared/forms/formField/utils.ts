import { FormikErrors, FormikTouched } from "formik";
import { get } from "lodash";

/* The function that encapsulates the logic of determining a value for Input field valid property. Note we have to
   return boolean | undefined value. Undefined should be returned when the field has not been touched by the user. */
export const isValid = (
  touched: FormikTouched<any>,
  errors: FormikErrors<any>,
  key: string,
): boolean | undefined => {
  if (get(touched, key)) {
    return !(errors && get(errors, key));
  }

  return undefined;
};

export const isNonValid = (
  touched: FormikTouched<any>,
  errors: FormikErrors<any>,
  name: string,
): boolean => {
  const valid = isValid(touched, errors, name);

  return !(valid === undefined || valid === true);
};
