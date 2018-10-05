import { expect } from "chai";
import * as YupTS from "./yup-ts";
import { NumberSchema } from "yup";

describe.only("yup-ts", () => {
  const animalValidator = YupTS.object({
    name: YupTS.string().optional()
  });

  const personValidatorTemplate = YupTS.object({
    fullName: YupTS.string(),
    middleName: YupTS.string().optional(),
    age: YupTS.number(),
    married: YupTS.boolean().optional(),
    animals: YupTS.array(animalValidator).optional(),
    url: YupTS.url().optional()
  });

  type TValidatorType = YupTS.TypeOf<typeof personValidatorTemplate>;
  const validator = personValidatorTemplate.toYup();

  it("should work as yup", () => {
    const validValue1: TValidatorType = {
      fullName: "Typical Millennial Dev",
      middleName: undefined,
      age: 21,
      married: false,
      animals: undefined,
      url: undefined
    };
    const validValue2 = { fullName: "Typical Millennial Dev", age: "21" }; // testing coercing
    const validValue3: TValidatorType = {
      fullName: "John Smith",
      middleName: "Peter",
      age: 21,
      married: false,
      animals: [{ name: "kitty" }],
      url: "http://www.foo.de"
    };

    expect(validator.isValidSync(validValue1)).to.be.true;
    expect(validator.isValidSync(validValue2)).to.be.true;
    expect(validator.isValidSync(validValue3)).to.be.true;

    expect(validator.isValidSync(5)).to.be.false;
    expect(validator.isValidSync({ fullName: "test" })).to.be.false; // missing values
    expect(validator.isValidSync({ ...validValue2, url: "fufu" })).to.be.false; // url
  });

  // assertions on types done according to: https://abstract.properties/typescript-compile-assertions.html
  it("should generate correct types", () => {
    type assert<T> = T extends {
      fullName: string;
      middleName: string | undefined;
      age: number;
      married: boolean | undefined;
      animals: Array<{ name: string | undefined }> | undefined;
      url: string | undefined
    }
      ? true
      : never;

    // tslint:disable-next-line
    const t: assert<TValidatorType> = true;
  });

  describe("onlyTrue", () => {
    it("allows only true", () => {
      const spec = YupTS.onlyTrue();
      const validator = spec.toYup();
      expect(validator.isValidSync(true)).to.be.true;
      expect(validator.isValidSync(false)).to.be.false;
      expect(validator.isValidSync(undefined)).to.be.false;
    });

    it("allows optional true", () => {
      const spec = YupTS.onlyTrue().optional();
      const validator = spec.toYup();
      expect(validator.isValidSync(true)).to.be.true;
      expect(validator.isValidSync(undefined)).to.be.true;
    });
  });

  it("should validate empty arrays", () => {
    const array = YupTS.array(animalValidator).toYup();

    expect(array.isValidSync([])).to.be.true;
    expect(array.isValidSync(null)).to.be.false;
  });

  it('can be enhanced by further validations', () => {
    const validator = YupTS.number().enhance((v: NumberSchema) => v.min(4)).toYup()

    expect(validator.isValidSync(2)).to.be.false
    expect(validator.isValidSync(5)).to.be.true
  })
});
