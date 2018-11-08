import { expect } from "chai";
import { convertToBigInt, formatThousands, normalize } from "./Number.utils";

describe("NumberUtils", () => {
  describe("formatThousands", () => {
    it("should format thousands", () => {
      expect(formatThousands("1000.0")).to.be.eq("1 000.0");
      expect(formatThousands("1000")).to.be.eq("1 000");
    });

    it("should not format decimal places", () => {
      expect(formatThousands("1000.0000")).to.be.eq("1 000.0000");
    });

    it("should handle undefined", () => {
      expect(formatThousands()).to.be.eq("");
      expect(formatThousands("")).to.be.eq("");
    });
  });

  describe("convertToBigInt", () => {
    it("converts decimal currencies to bigInt representation", () => {
      expect(convertToBigInt("123.4567")).to.eq("123456700000000000000");
      expect(convertToBigInt("123.4567", 6)).to.eq("123456700");
      expect(convertToBigInt("123.4567", 2)).to.eq("12346");
      expect(convertToBigInt("65.4321", 2)).to.eq("6544");
    });
  });

  describe("normalize", () => {
    it("should normalize given number to a specified range", () => {
      expect(normalize({ min: 0, max: 100 }, 100)).to.eq(1);
      expect(normalize({ min: 0, max: 100 }, 0)).to.eq(0);
      expect(normalize({ min: 0, max: 100 }, 25)).to.eq(0.25);
      expect(normalize({ min: 0, max: 100 }, 80)).to.eq(0.8);
    });
  });
});
