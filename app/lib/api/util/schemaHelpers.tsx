import { includes, mapValues } from "lodash";
import * as moment from "moment";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import * as Yup from "yup";

/**
 * Schema helpers
 * semi documented.... :)
 */
export const makeAllRequired = (schema: Yup.ObjectSchema<any>): Yup.ObjectSchema<any> => {
  const oldFields: { [key: string]: Yup.MixedSchema } = (schema as any).fields;
  const newFields = mapValues(oldFields, schema => schema.required());
  return Yup.object().shape(newFields);
};

/**
 * Date schema
 */
const DATE_SCHEME = "YYYY-M-D";
const parse = (s: string) => moment(s, DATE_SCHEME, true);
export const date = Yup.string()
  .transform(function(_value: any, originalValue: string): string {
    const date = parse(originalValue);
    if (!date.isValid()) {
      return "";
    }
    return date.format(DATE_SCHEME);
  })
  .test("is-valid", <FormattedMessage id="form.field.error.invalid-date" /> as any, s => {
    return parse(s).isValid();
  });

//TODO: Add translations
export const personBirthDate = date
  .test("is-old-enough", <FormattedMessage id="form.field.error.older-than-18" /> as any, s => {
    const d = parse(s);
    return d.isValid() && d.isBefore(moment().subtract(18, "years"));
  })
  .test(
    "is-young-enough",
    <FormattedMessage id="form.field.error.younger-than-100" /> as any,
    s => {
      const d = parse(s);
      return d.isValid() && d.isAfter(moment().subtract(100, "years"));
    },
  );

export const foundingDate = date.test(
  "is-old-enough",
  <FormattedMessage id="form.field.error.founding-date-in-future" /> as any,
  s => {
    const d = parse(s);
    return d.isValid() && d.isBefore(moment());
  },
);

export const citizen = Yup.bool();

//TODO: add to translations
export const isUsCitizen = citizen.test(
  "is-us-citizen",
  <FormattedMessage id="form.field.error.us-citizen" /> as any,
  response => response === false,
);

export const countryCode = Yup.string();
export const RESTRICTED_COUNTRIES = [
  "KP",
  "ET",
  "IR",
  "PK",
  "RS",
  "LK",
  "SY",
  "TT",
  "TN",
  "YE",
  "US",
];

export const restrictedCountry = countryCode.test(
  "country",
  <FormattedMessage id="form.field.error.restricted-country" /> as any,
  response => !includes(RESTRICTED_COUNTRIES, response),
);
