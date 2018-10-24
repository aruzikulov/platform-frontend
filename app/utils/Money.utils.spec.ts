import { expect } from "chai";
import { formatMoney } from "./Money.utils";

describe("Money utils", () => {
  describe("formatMoney", () => {
    it("should format money", () => {
      expect(formatMoney("10000", 2, 2)).to.be.eq("100.00");
      expect(formatMoney("10000", 5, 2)).to.be.eq("0.10");
      expect(formatMoney("100000000000000000000", 1, 1)).to.be.eq("10000000000000000000.0");
    });
  });
});
