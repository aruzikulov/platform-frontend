import { expect } from "chai";

import { getInvestmentAmount, getSharePrice } from "./EtoUtils";

describe("EtoUtils", () => {
  describe("getSharePrice", () => {
    it("should return correct sharePrice", () => {
      expect(getSharePrice({ preMoneyValuationEur: 1000, existingCompanyShares: 100 })).to.equal(
        10,
      );
    });

    it("should return sharePrice as 0 when one of argument is undefined", () => {
      expect(
        getSharePrice({ preMoneyValuationEur: 100, existingCompanyShares: undefined }),
      ).to.equal(0);
      expect(
        getSharePrice({ preMoneyValuationEur: undefined, existingCompanyShares: 100 }),
      ).to.equal(0);
    });
  });

  describe("getInvestmentAmount", () => {
    it("should calculate correctly minInvestmentAmount", () => {
      const { minInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: 1000,
        existingCompanyShares: 10,
        minimumNewSharesToIssue: 100,
        newSharesToIssue: undefined,
        newSharesToIssueInFixedSlots: 10,
        newSharesToIssueInWhitelist: 5,
        fixedSlotsMaximumDiscountFraction: 0.8,
        whitelistDiscountFraction: 0.5,
      });

      expect(minInvestmentAmount).to.equal(8950);
    });

    it("should return minInvestmentAmount as 0 when minimumNewSharesToIssue is 0", () => {
      const { minInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: 1000,
        existingCompanyShares: 10,
        minimumNewSharesToIssue: 0,
        newSharesToIssue: undefined,
        newSharesToIssueInFixedSlots: 10,
        newSharesToIssueInWhitelist: 5,
        fixedSlotsMaximumDiscountFraction: 0.8,
        whitelistDiscountFraction: 0.5,
      });

      expect(minInvestmentAmount).to.equal(0);
    });

    it("should calculate correctly maxInvestmentAmount", () => {
      let { minInvestmentAmount, maxInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: 1000,
        existingCompanyShares: 10,
        newSharesToIssue: 1000,
        minimumNewSharesToIssue: undefined,
        newSharesToIssueInFixedSlots: 10,
        newSharesToIssueInWhitelist: 5,
        fixedSlotsMaximumDiscountFraction: 0.8,
        whitelistDiscountFraction: 0.5,
      });

      expect(maxInvestmentAmount).to.equal(98950);
      expect(minInvestmentAmount).to.equal(0);

      // general test case
      ({ minInvestmentAmount, maxInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: 125000000,
        existingCompanyShares: 40859,
        newSharesToIssue: 3652,
        minimumNewSharesToIssue: 1000,
        newSharesToIssueInFixedSlots: 2252,
        newSharesToIssueInWhitelist: 700,
        fixedSlotsMaximumDiscountFraction: 0.6,
        whitelistDiscountFraction: 0.4,
      }));

      expect(Math.round(maxInvestmentAmount)).to.equal(6182236);
      expect(Math.round(minInvestmentAmount)).to.equal(1223721);
      //assert round(eto.max_investment_amount()) == 11172569
      //assert round(eto.max_investment_amount_with_all_discounts()) == 6182236
      // assert round(eto.min_investment_amount()) == 1223721

      // same terms but without whitelist
      ({ minInvestmentAmount, maxInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: 125000000,
        existingCompanyShares: 40859,
        newSharesToIssue: 2952,
        minimumNewSharesToIssue: 1000,
        newSharesToIssueInFixedSlots: 2252,
        newSharesToIssueInWhitelist: 0,
        fixedSlotsMaximumDiscountFraction: 0.6,
        whitelistDiscountFraction: 0.4,
      }));

      expect(Math.round(maxInvestmentAmount)).to.equal(4897330);
      expect(Math.round(minInvestmentAmount)).to.equal(1223721);

      // no discounts
      ({ minInvestmentAmount, maxInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: 125000000,
        existingCompanyShares: 40859,
        newSharesToIssue: 3652,
        minimumNewSharesToIssue: 0,
        newSharesToIssueInFixedSlots: 2252,
        newSharesToIssueInWhitelist: 700,
        fixedSlotsMaximumDiscountFraction: 0,
        whitelistDiscountFraction: 0,
      }));

      expect(Math.round(maxInvestmentAmount)).to.equal(Math.round(3652 * (125000000 / 40859)));
      expect(Math.round(minInvestmentAmount)).to.equal(0);
    });

    it("should return maxInvestmentAmount as 0 when newSharesToIssue is 0", () => {
      const { minInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: 1000,
        existingCompanyShares: 10,
        newSharesToIssue: 0,
        minimumNewSharesToIssue: undefined,
        newSharesToIssueInFixedSlots: 10,
        newSharesToIssueInWhitelist: 5,
        fixedSlotsMaximumDiscountFraction: 0.8,
        whitelistDiscountFraction: 0.5,
      });

      expect(minInvestmentAmount).to.equal(0);
    });
  });
});
