import { expect } from "chai";

import { formatDate, isLessThanNDays } from "./Date.utils";

describe("date.utils", () => {
  describe("formatDate", () => {
    it("formats dates", () => {
      const date = new Date("12/24/2018");
      expect(formatDate(date.getTime())).to.equal("2018-12-24");
    });
  });

  describe("isLessThanNDays", () => {
    it("compares dates", () => {
      const date1 = new Date("12/24/2018");
      const date2 = new Date("12/20/2018");
      const date3 = new Date("12/22/2018");
      const date4 = new Date("12/21/2018");

      expect(isLessThanNDays(date2, date1, 3)).to.be.false;
      expect(isLessThanNDays(date3, date1, 3)).to.be.true;
      expect(isLessThanNDays(date4, date1, 3)).to.be.false;
      expect(isLessThanNDays(date4, date1, 4)).to.be.true;
    });
  });
});
