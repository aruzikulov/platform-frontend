import { mapValues } from "lodash";
import * as Yup from "yup";
import { Dictionary } from "../types";

export const object = <T>(objectShape: T) => new ObjectYTS(objectShape);
export const string = () => new StringYTS();
export const url = () => new StringYTS().enhance((v: Yup.StringSchema) => v.url());
export const array = <T extends YTS<any>>(shape: T) => new ArrayYTS(shape);
export const number = () => new NumberYTS();
export const boolean = () => new BooleanYTS();
export const onlyTrue = () =>
  new BooleanYTS().enhance(v =>
    v.test(
      "isTrue",
      "This field must be set to true",
      value => value === undefined || value === true,
    ),
  );

export type TypeOf<T extends YTS<any>> = T["_T"];
type TypeOfProps<P extends Dictionary<any>> = { [K in keyof P]: TypeOf<P[K]> };

export type Schema<T> = ObjectYTS<T>;

class YTS<T> {
  _T!: T;

  constructor(protected validator: Yup.Schema<any>, protected isRequired = true) {}

  toYup(): Yup.Schema<any> {
    return this.isRequired ? this.validator.required() : this.validator;
  }

  enhance(updateValidator: (validator: Yup.NumberSchema) => Yup.NumberSchema): YTS<T>;
  enhance(updateValidator: (validator: Yup.StringSchema) => Yup.StringSchema): YTS<T>;
  enhance(updateValidator: (validator: Yup.ArraySchema<T>) => Yup.ArraySchema<T>): YTS<T>;
  enhance(updateValidator: (validator: Yup.ObjectSchema<T>) => Yup.ObjectSchema<T>): YTS<T>;
  enhance(updateValidator: (validator: Schema<T>) => Yup.Schema<T>): YTS<T>;
  enhance(updateValidator: (validator: any) => any): YTS<T> {
    return new YTS<T>(updateValidator(this.validator), this.isRequired);
  }

  optional(): YTS<T | undefined> {
    return new YTS(this.validator, false);
  }
}

class ObjectYTS<T> extends YTS<TypeOfProps<T>> {
  shape: T;
  constructor(shape: T) {
    const validator = Yup.object(mapValues(shape as any, s => s.toYup()));
    super(validator as any);
    this.shape = shape;
  }
}

class StringYTS extends YTS<string> {
  constructor() {
    super(Yup.string());
  }
}

class NumberYTS extends YTS<number> {
  constructor() {
    super(Yup.number());
  }
}

class BooleanYTS extends YTS<boolean> {
  constructor() {
    super(Yup.boolean());
  }
}

class ArrayYTS<T extends YTS<any>> extends YTS<Array<TypeOf<T>>> {
  constructor(shape: T) {
    const validator = Yup.array().of(shape.toYup());
    super(validator);
  }

  // override toYup
  toYup(): Yup.Schema<any> {
    if (this.isRequired) {
      // we can't use here .required() since it will throw on empty array. See: https://github.com/jquense/yup/issues/189
      return this.validator.test(
        "is-required",
        "This field is required",
        val => val !== undefined && val !== null,
      );
    }
    return this.validator;
  }
}
