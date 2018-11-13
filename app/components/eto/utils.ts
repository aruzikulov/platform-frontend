import { cloneDeep, flow, get, set } from "lodash";

export interface ICompoundField {
  [x: string]: string | number | undefined;
}

//TODO remove it. Data should come from backend with all defaults set
export const applyDefaults = (data: any, defaults: any) => {
  const dataCopy = { ...data };

  return Object.keys(defaults).reduce((acc, key) => {
    if (acc[key] === undefined || acc[key] === null) {
      acc[key] = defaults[key];
    }
    return acc;
  }, dataCopy);
};

/**** DATA CONVERSION FUNCTIONS ****/

export const convert = (data: any, conversionSpec: any) => {
  if (data) {
    const dataCopy = cloneDeep(data);
    Object.keys(conversionSpec).forEach(key => {
      const fieldValue = get(dataCopy, key);
      set(dataCopy, key, convertField(fieldValue, conversionSpec[key]));
    });
    return dataCopy;
  } else {
    return data;
  }
};

const convertField = (input: any, f: any) => {
  if (Array.isArray(f)) {
    return flow(f)(input);
  } else {
    return input !== undefined && input !== null ? f(input) : input;
  }
};

export const convertInArray = (conversionSpec: any) => (arr: any[]) => {
  return arr.map(element => {
    return convert(element, conversionSpec);
  });
};

//removes data left from empty key-value fields, e.g. {key:undefined,value:undefined}
export const removeEmptyKeyValueFields = () => (data: ICompoundField[] | undefined) => {
  if (data !== undefined && data !== null) {
    const cleanData = data.filter(compoundField => {
      const keys = Object.keys(compoundField);
      return compoundField[keys[0]] !== undefined && compoundField[keys[1]] !== undefined;
    });
    return cleanData.length ? cleanData : undefined;
  } else {
    return undefined;
  }
};

export const convertPercentageToFraction = () => (data: number) =>
  parseFloat((data / 100).toPrecision(4));

export const convertFractionToPercentage = () => (data: number) =>
  parseFloat((data * 100).toFixed(2));

export const parseStringToFloat = () => (data: string | number | undefined) => {
  if (typeof data === "string") {
    const result = parseFloat(data);
    return Number.isNaN(result) ? undefined : result;
  } else {
    return data;
  }
};

export const parseStringToInteger = () => (data: string | number | undefined) => {
  if (typeof data === "string") {
    const result = parseInt(data, 10);
    return Number.isNaN(result) ? undefined : result;
  } else {
    return data;
  }
};

export const convertToPrecision = (precision: number) => (data: number) => {
  if (data && !Number.isNaN(data)) {
    return parseFloat(
      data.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: precision,
      }),
    );
  } else {
    return undefined;
  }
};
