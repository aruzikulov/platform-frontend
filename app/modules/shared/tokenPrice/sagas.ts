import { BigNumber } from "bignumber.js";
import * as promiseAll from "promise-all";
import { delay } from "redux-saga";
import { put } from "redux-saga/effects";
import { Q18 } from "../../../config/constants";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions } from "../../actions";
import { numericValuesToString } from "../../contracts/utils";
import { neuCall } from "../../sagas";
import { neuTakeUntil } from "../../sagasUtils";
import { ITokenPriceStateData } from "./reducer";

const TOKEN_PRICE_MONITOR_DELAY = 5000;

export async function loadTokenPriceDataAsync ({
  contractsService,
}: TGlobalDependencies): Promise<ITokenPriceStateData> {
  // todo: remove placeholders when contracts deployed on production
  // display error info when price outdated. price outdated may be checked via platformTerms
  if (contractsService.rateOracle) {
    return contractsService.rateOracle
      .getExchangeRates(
        [contractsService.etherToken.address, contractsService.neumark.address],
        [contractsService.euroToken.address, contractsService.euroToken.address],
      )
      .then(r =>
        Object.assign(
          numericValuesToString({
            etherPriceEur: r[0][0].div(Q18),
            neuPriceEur: r[0][1].div(Q18),
          }),
          { priceOutdated: false },
        ),
      );
  } else {
    return Object.assign(
      numericValuesToString({
        etherPriceEur: new BigNumber("483.96"),
        neuPriceEur: new BigNumber("0.500901"),
      }),
      { priceOutdated: true },
    );
  }
}

function* tokenPriceMonitor({ logger }: TGlobalDependencies): any {
  while (true) {
    logger.info("Querying for tokenPrice");

    const tokenPriceData = yield neuCall(loadTokenPriceDataAsync);
    yield put(actions.tokenPrice.saveTokenPrice(tokenPriceData));

    yield delay(TOKEN_PRICE_MONITOR_DELAY);
  }
}

export function* tokenPriceSagas(): any {
  yield neuTakeUntil("AUTH_LOAD_USER", "AUTH_LOGOUT", tokenPriceMonitor);
}
