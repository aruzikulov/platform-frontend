import { IAppState } from "../../../store";

export const selectTokenPriceData = (state: IAppState) => state.tokenPrice.tokenPriceData;

export const selectEtherPriceEur = (state: IAppState) => {
  const data = selectTokenPriceData(state);
  return (data && data.etherPriceEur) || "0";
};

export const selectNeuPriceEur = (state: IAppState) => {
  const data = selectTokenPriceData(state);
  return (data && data.neuPriceEur) || "0";
};

export const selectEurPriceEther = (state: IAppState) => {
  const data = selectTokenPriceData(state);
  return (data && data.eurPriceEther) || "0";
};
