import BigNumber from "bignumber.js";

import { TCompanyEtoData, TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces";

export interface IEtoTotalInvestment {
  totalEquivEurUlps: BigNumber;
  totalTokensInt: BigNumber;
  totalInvestors: BigNumber;
}

export enum ETOStateOnChain {
  Setup = 0, // Initial state
  Whitelist = 1,
  Public = 2,
  Signing = 3,
  Claim = 4,
  Payout = 5, // Terminal state
  Refund = 6, // Terminal state
}

export type TEtoStartOfStates = Record<ETOStateOnChain, Date | undefined>;

export interface IEtoContractData {
  timedState: ETOStateOnChain;
  totalInvestment: IEtoTotalInvestment;
  startOfStates: TEtoStartOfStates;
}

export type TEtoWithCompanyAndContract = TEtoSpecsData & {
  // contract is undefined when ETO is not on blockchain
  contract?: IEtoContractData;
  company: TCompanyEtoData;
};
