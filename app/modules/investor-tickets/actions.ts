import { TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces";
import { Dictionary } from "../../types";
import { createAction } from "../actionsUtils";
import { IInvestorTicket } from "./types";

export const investorEtoTicketActions = {
  // public actions
  loadEtoInvestorTicket: (eto: TEtoSpecsData) => createAction("INVESTOR_TICKET_LOAD", { eto }),
  loadInvestorTickets: (etos: Dictionary<TEtoSpecsData>) =>
    createAction("INVESTOR_TICKET_ETOS_LOAD", { etos }),
  claim: (etoId: string) => createAction("INVESTOR_TICKET_CLAIM", { etoId }),

  // state mutations
  setEtoInvestorTicket: (etoId: string, ticket: IInvestorTicket) =>
    createAction("INVESTOR_TICKET_SET", { etoId, ticket }),
};
