export interface ICompoundField {
  [x: string]: string | number | undefined;
}

export const sanitizeKeyValueCompoundField = (data: ICompoundField[] | undefined) => {
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

//TODO this is very primitive for now. First we need determine how/where to store defaults
export const applyDefaults = (data: any, defaults: any) => {
  const dataCopy = { ...data };

  return Object.keys(defaults).reduce((acc, key) => {
    if (acc[key] === undefined || acc[key] === null) {
      acc[key] = defaults[key];
    }
    return acc;
  }, dataCopy);
};
