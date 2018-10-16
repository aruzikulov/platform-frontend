import { IAppState } from "./../../store";
import { GasModelShape } from "../../lib/api/GasApi";
import { IGasState } from "./reducer";

export const selectIsAlreadyLoaded = (state: IAppState): boolean =>
  !state.gas.loading && !!state.gas.gasPrice;

export const selectGasPrice = (state: IAppState): GasModelShape | undefined => state.gas.gasPrice;
