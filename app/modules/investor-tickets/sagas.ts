import { filter, map } from "lodash/fp";
import { all, fork, put, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";

import { IUser } from "../../lib/api/users/interfaces";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { IAppState } from "../../store";
import { actions, TAction } from "../actions";
import { selectUser } from "../auth/selectors";
import { neuTakeEvery } from "../sagas";
import { convertToInvestorTicket } from "./utils";

export function* loadEtosWithInvestorTickets(
  { notificationCenter }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "INVESTOR_TICKET_ETOS_LOAD") return;

  try {
    yield put(actions.publicEtos.loadEtos());

    const action = yield take("PUBLIC_ETOS_SET_PUBLIC_ETOS");

    yield all(
      map(
        eto => put(actions.investorEtoTicket.loadEtoInvestorTicket(eto.etoId)),
        filter(eto => eto.state === "on_chain", action.payload.etos),
      ),
    );

    yield;
  } catch (e) {
    notificationCenter.error("Could not load portfolio");
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadEtoInvestorTicket(
  { contractsService }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "INVESTOR_TICKET_LOAD") return;

  const etoId = action.payload.etoId;
  const user: IUser = yield select((state: IAppState) => selectUser(state.auth));

  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(etoId);

  const investorTickerRaw = yield etoContract.investorTicket(user.userId);

  yield put(
    actions.investorEtoTicket.setEtoInvestorTicket(
      etoId,
      convertToInvestorTicket(investorTickerRaw),
    ),
  );
}

export function* investorTicketsSagas(): any {
  yield fork(neuTakeEvery, "INVESTOR_TICKET_ETOS_LOAD", loadEtosWithInvestorTickets);
  yield fork(neuTakeEvery, "INVESTOR_TICKET_LOAD", loadEtoInvestorTicket);
}
