import { filter, map } from "lodash/fp";
import { all, fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { EtoState, TPublicEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { IUser } from "../../lib/api/users/interfaces";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { promisify } from "../../lib/contracts/typechain-runtime";
import { IAppState } from "../../store";
import { convertToBigInt } from "../../utils/Number.utils";
import { actions, TAction } from "../actions";
import { selectUser } from "../auth/selectors";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { convertToCalculatedContribution, convertToInvestorTicket } from "./utils";

export function* loadInvestorTickets({ logger }: TGlobalDependencies, action: TAction): any {
  if (action.type !== "INVESTOR_TICKET_ETOS_LOAD") return;

  try {
    yield all(
      map(
        eto => put(actions.investorEtoTicket.loadEtoInvestorTicket(eto)),
        filter(eto => eto.state === EtoState.ON_CHAIN, action.payload.etos),
      ),
    );

    yield;
  } catch (e) {
    logger.error("Could not load investor tickets", e);
  }
}

export function* loadInvestorTicket(
  { contractsService }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "INVESTOR_TICKET_LOAD") return;

  if (action.payload.eto.state !== EtoState.ON_CHAIN) {
    throw new Error("Should be called only when eto is on chain");
  }

  const etoId = action.payload.eto.etoId;
  const user: IUser = yield select((state: IAppState) => selectUser(state.auth));

  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(etoId);

  const investorTickerRaw = yield etoContract.investorTicket(user.userId);
  yield put(
    actions.investorEtoTicket.setEtoInvestorTicket(
      etoId,
      convertToInvestorTicket(investorTickerRaw),
    ),
  );

  yield neuCall(loadComputedContributionFromContract, action.payload.eto);
}

export function* loadComputedContributionFromContract(
  { contractsService }: TGlobalDependencies,
  eto: TPublicEtoData,
  amountEuroUlps?: string,
  isICBM = false,
): any {
  if (eto.state !== EtoState.ON_CHAIN) return;

  const state: IAppState = yield select();
  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);

  if (etoContract) {
    const newInvestorContributionEurUlps =
      amountEuroUlps || convertToBigInt((eto.minTicketEur && eto.minTicketEur.toString()) || "0");

    const from = selectEthereumAddressWithChecksum(state);

    // TODO: check whether typechain but still is not fixed
    // sorry no typechain, typechain has a bug with boolean casting
    const calculation = yield promisify(etoContract.rawWeb3Contract.calculateContribution, [
      from,
      isICBM,
      newInvestorContributionEurUlps,
    ]);

    yield put(
      actions.investorEtoTicket.setCalculatedContribution(
        eto.etoId,
        convertToCalculatedContribution(calculation),
      ),
    );
  }
}

export function* investorTicketsSagas(): any {
  yield fork(neuTakeEvery, "INVESTOR_TICKET_ETOS_LOAD", loadInvestorTickets);
  yield fork(neuTakeEvery, "INVESTOR_TICKET_LOAD", loadInvestorTicket);
}
