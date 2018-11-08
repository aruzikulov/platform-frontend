import { IAppState } from "../../../store";
import { ITokenPriceStateData } from "./reducer";

export const selectTokenPriceData = (state: IAppState): ITokenPriceStateData | undefined =>
  state.tokenPrice.tokenPriceData;

export const selectEtherPriceEur = (state: IAppState): string => {
  const data = selectTokenPriceData(state);
  return (data && data.etherPriceEur) || "0";
};

export const selectNeuPriceEur = (state: IAppState): string => {
  const data = selectTokenPriceData(state);
  return (data && data.neuPriceEur) || "0";
};

export const selectEurPriceEther = (state: IAppState): string => {
  const data = selectTokenPriceData(state);
  return (data && data.eurPriceEther) || "0";
};
