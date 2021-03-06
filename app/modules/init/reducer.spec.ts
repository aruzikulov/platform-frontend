import { expect } from "chai";

import { actions } from "../actions";
import { initInitialState, initReducer } from "./reducer";

describe("init > reducer", () => {
  it("should act on INIT_DONE", () => {
    const action = actions.init.done("appInit");
    const previousState = initInitialState;

    const newState = initReducer(previousState, action);

    expect(newState).to.be.deep.eq({
      ...initInitialState,
      appInit: {
        inProgress: false,
        done: true,
      },
    });
  });

  it("should act on INIT_ERROR", () => {
    const expectedError = "SOME ERROR";
    const action = actions.init.error("appInit", expectedError);
    const previousState = initInitialState;

    const newState = initReducer(previousState, action);

    expect(newState).to.be.deep.eq({
      ...initInitialState,
      appInit: {
        inProgress: false,
        done: false,
        error: expectedError,
      },
    });
  });
});
