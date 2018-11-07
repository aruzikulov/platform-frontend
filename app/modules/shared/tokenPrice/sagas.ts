import { BigNumber } from "bignumber.js";
import { delay } from "redux-saga";
import { put, select, takeLatest } from "redux-saga/effects";
import { selectTokenPriceData } from "./selectors";

import { Q18 } from "../../../config/constants";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { IAppState } from "../../../store";
import { actions } from "../../actions";
import { numericValuesToString } from "../../contracts/utils";
import { selectIsSmartContractInitDone } from "../../init/selectors";
import { neuCall } from "../../sagasUtils";
import { ITokenPriceStateData } from "./reducer";

const TOKEN_PRICE_MONITOR_DELAY = 120000;
const TOKEN_PRICE_MONITOR_SHORT_DELAY = 1000;

export async function loadTokenPriceDataAsync({
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
  const isSmartContractInitDone: boolean = yield select(selectIsSmartContractInitDone);

  if (!isSmartContractInitDone) return;

  while (true) {
    try {
      logger.info("Querying for tokenPrice");

      const tokenPriceData = yield neuCall(loadTokenPriceDataAsync);
      const price: ITokenPriceStateData | undefined = yield select((s: IAppState) =>
        selectTokenPriceData(s.tokenPrice),
      );

      if (
        !price ||
        price.etherPriceEur !== tokenPriceData.etherPriceEur ||
        price.neuPriceEur !== tokenPriceData.neuPriceEur
      ) {
        yield put(actions.tokenPrice.saveTokenPrice(tokenPriceData));
      }
    } catch (e) {
      logger.error("Token Price Oracle Failed", e);
      yield delay(TOKEN_PRICE_MONITOR_SHORT_DELAY);
      continue;
    }
    yield delay(TOKEN_PRICE_MONITOR_DELAY);
  }
}

export function* tokenPriceSagas(): any {
  yield takeLatest("INIT_DONE", neuCall, tokenPriceMonitor);
}
