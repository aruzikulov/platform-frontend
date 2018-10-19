import { GasModelShape } from "../../lib/api/GasApi";
import { IAppState } from "./../../store";

export const selectIsAlreadyLoaded = (state: IAppState): boolean =>
  !state.gas.loading && !!state.gas.gasPrice;

export const selectGasPrice = (state: IAppState): GasModelShape | undefined => state.gas.gasPrice;

export const selectStandardGasPrice = (state: IAppState): string =>
  (state.gas.gasPrice && state.gas.gasPrice.standard) || "0";
