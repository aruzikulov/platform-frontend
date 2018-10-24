import { compose, includes } from "lodash/fp";
import { reach, Schema } from "yup";

const getSchemaTests = <T>(schema: Schema<T>): string[] => schema.describe().tests;

export const getFieldSchema = <T>(name: string, schema: Schema<T>) => reach(schema, name);

export const isRequired = compose(
  includes("required"),
  getSchemaTests,
);
