import { expect } from "chai";

import { IAppState } from "../../../store";
import { DeepPartial } from "../../../types";
import { selectBankTransferReferenceCode } from "../selectors";

function createStateWithAddress(address: string): IAppState {
  const state: DeepPartial<IAppState> = {
    web3: { connected: true, wallet: { address } },
    investmentFlow: {},
  };
  return state as IAppState;
}

describe("investment-flow > selectors", () => {
  describe("selectBankTransferReferenceCode", () => {
    it("generates a code from the address and gasprice", () => {
      const code1 = selectBankTransferReferenceCode(
        createStateWithAddress("0x0061c60a6477bb64aEc5dc8d3C892cC53C8084a3"),
      );
      const code2 = selectBankTransferReferenceCode(
        createStateWithAddress("0x6e9A689BF3E87F7fc945D345A869841787447a35"),
      );
      const code3 = selectBankTransferReferenceCode(
        createStateWithAddress("0x822060c96E012Bf88D08635A543210D1029b658D"),
      );
      expect(code1).to.equal("NF AGHGCmR3u2SuxdyNPIksxTyAhKM");
      expect(code2).to.equal("NF bppom/Pof3/JRdNFqGmEF4dEejU");
      expect(code3).to.equal("NF giBgyW4BK/iNCGNaVDIQ0QKbZY0");
    });

    it("adds a gas stipend appendix", () => {
      const state = createStateWithAddress("0x0061c60a6477bb64aEc5dc8d3C892cC53C8084a3");
      state.investmentFlow.bankTransferGasStipend = true;

      const code = selectBankTransferReferenceCode(state);
      expect(code).to.equal("NF AGHGCmR3u2SuxdyNPIksxTyAhKM G");
    });
  });
});
