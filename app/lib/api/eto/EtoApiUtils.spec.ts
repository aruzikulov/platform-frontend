import { expect } from "chai";
import * as Yup from "yup";
import { findMax, findMin } from "./EtoApiUtils";

describe("EtoApiUtils", () => {
  const min = 1;
  const max = 20;
  const schema = Yup.number()
    .min(min)
    .max(max);

  describe("findMax", () => {
    it("finds yup.max() value", () => {
      expect(findMin(schema)).to.be.equal(min);
    });
  });
  describe("findMin", () => {
    it("finds yup.min() value", () => {
      expect(findMax(schema)).to.be.equal(max);
    });
  });
});
