import { expect } from "chai";

import * as Yup from "yup";
import { isFieldRequired, isNonValid, isValid } from "./utils";

describe("Form utils", () => {
  describe("isValid", () => {
    it("should return undefined when not touched", () => {
      const result = isValid({ field: false as any }, {}, "field");

      expect(result).to.be.undefined;
    });

    it("should return false when touched and with error", () => {
      const result = isValid({ field: true as any }, { field: "ERROR" }, "field");

      expect(result).to.be.false;
    });

    it("should return false when touched and with error", () => {
      const result = isValid({ field: true as any }, {}, "field");

      expect(result).to.be.true;
    });
  });

  describe("isNonValid", () => {
    it("should return false on valid forms", () => {
      const result = isNonValid({ field: true as any }, {}, "field");

      expect(result).to.be.false;
    });

    it("should return true on invalid forms", () => {
      const result = isNonValid({ field: true as any }, { field: "ERROR" }, "field");

      expect(result).to.be.true;
    });

    it("should return false on not touched forms", () => {
      const result = isNonValid({ field: false as any }, {}, "field");

      expect(result).to.be.false;
    });
  });
});

describe("isFieldRequired", () => {
  it("should return true for a required field with yup schema", () => {
    const schema = Yup.object({ key: Yup.string().required() });
    expect(isFieldRequired(schema, "key")).to.be.true;
  });
  it("should return false for an optional field with yup schema", () => {
    const schema = Yup.object({ key1: Yup.string(), key2: Yup.string().notRequired() });
    expect(isFieldRequired(schema, "key1")).to.be.false;
    expect(isFieldRequired(schema, "key2")).to.be.false;
  });
});
