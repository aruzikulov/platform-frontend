import { connect, InferableComponentEnhancerWithProps, Options } from "react-redux";
import { LocationChangeAction, routerReducer, RouterState } from "react-router-redux";
import { combineReducers } from "redux";

import { TAction } from "./modules/actions";
import { initInitialState } from "./modules/init/reducer";
import { appReducers } from "./modules/reducer";
import { DeepReadonly, FunctionWithDeps } from "./types";

export interface IAppAction {
  type: string;
  payload?: any;
}
export type ActionType<T extends IAppAction> = T["type"];
export type ActionPayload<T extends IAppAction> = T["payload"];

export type AppDispatch = (a: AppActionTypes | FunctionWithDeps) => void;

export type AppReducer<S> = (
  state: DeepReadonly<S> | undefined,
  action: AppActionTypes,
) => DeepReadonly<S>;

type TRouterActions = LocationChangeAction;

// add new external actions here
export type AppActionTypes = TAction | TRouterActions;

// add all custom reducers here
const allReducers = {
  ...appReducers,
  router: routerReducer,
};

// base on reducers we can infer type of app state
type TReducersMap<T> = { [P in keyof T]: AppReducer<T[P]> };
type TReducersMapToReturnTypes<T> = T extends TReducersMap<infer U> ? U : never;
export type IAppState = TReducersMapToReturnTypes<typeof appReducers> & {
  router: RouterState;
};

export const rootReducer = combineReducers<IAppState>(allReducers);

// All states that should remain even after logout
const staticValues = (state: IAppState): any => ({
  router: state.router,
  init: { ...initInitialState, smartcontractsInit: state.init.smartcontractsInit },
});

export const reducers = (state: IAppState, action: TAction) => {
  switch (action.type) {
    case "AUTH_LOGOUT":
      return rootReducer(staticValues(state), action);
  }
  return rootReducer(state, action);
};

interface IAppConnectOptions<S, D, O> {
  stateToProps?: (state: IAppState, ownProps: O) => S;
  dispatchToProps?: (dispatch: AppDispatch, ownProps: O) => D;
  options?: Options<IAppState, S, {}>;
}

// helper to use instead of redux connect. It's bound with our app state and it uses dictionary to pass arguments
export function appConnect<S = {}, D = {}, O = {}>(
  config: IAppConnectOptions<S, D, O>,
): InferableComponentEnhancerWithProps<S & D, O> {
  return connect<S, D, O, IAppState>(
    config.stateToProps!,
    config.dispatchToProps!,
    undefined,
    config.options as any,
  );
}
