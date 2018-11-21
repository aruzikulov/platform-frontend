import "reflect-metadata";

import "./config/yupLocales";

import "font-awesome/scss/font-awesome.scss";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./styles/bootstrap.scss";
import "./styles/overrides.scss";

import createHistory from "history/createBrowserHistory";
import { Container } from "inversify";
import { compact } from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { hot } from "react-hot-loader";
import { initializePhraseAppEditor } from "react-intl-phraseapp";
import { Provider as ReduxProvider } from "react-redux";
import { ConnectedRouter, routerMiddleware } from "react-router-redux";
import { applyMiddleware, createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";

import { App } from "./components/App";
import { getConfig } from "./config/getConfig";
import {
  createGlobalDependencies,
  customizerContainerWithMiddlewareApi,
  setupBindings,
  TGlobalDependencies,
} from "./di/setupBindings";
import { symbols } from "./di/symbols";
import { ILogger } from "./lib/dependencies/Logger";
import { createInjectMiddleware } from "./middlewares/redux-injectify";
import { reduxLogger } from "./middlewares/redux-logger";
import { rootSaga } from "./modules/sagas";
import { IAppState, reducers } from "./store";
import * as ga from "./utils/googleAnalitycs.js";
import { IntlProviderAndInjector } from "./utils/IntlProviderAndInjector";
import { InversifyProvider } from "./utils/InversifyProvider";

// @note: this is done to make HMR work with react router. In production build its gone.
function forceRerenderInDevMode(): number {
  if (process.env.NODE_ENV === "development") {
    return Math.random();
  } else {
    return 1;
  }
}

function renderApp(
  store: Store<IAppState>,
  history: any,
  container: Container,
  Component: React.ComponentClass,
): void {
  const mountNode = document.getElementById("app");

  ReactDOM.render(
    <ReduxProvider store={store}>
      <InversifyProvider container={container}>
        <ConnectedRouter key={forceRerenderInDevMode()} history={history}>
          <IntlProviderAndInjector>
            <Component />
          </IntlProviderAndInjector>
        </ConnectedRouter>
      </InversifyProvider>
    </ReduxProvider>,
    mountNode,
  );
}

function startupApp(history: any): { store: Store<IAppState>; container: Container } {
  const config = getConfig(process.env);
  const container = setupBindings(config);

  const context: { container: Container; deps?: TGlobalDependencies } = {
    container,
  };

  const logger = container.get<ILogger>(symbols.logger);

  const sagaMiddleware = createSagaMiddleware({ context });

  const middleware = applyMiddleware(
    ...compact([
      routerMiddleware(history),
      createInjectMiddleware(container, customizerContainerWithMiddlewareApi),
      sagaMiddleware,
      process.env.NODE_ENV === "production" && reduxLogger(logger),
    ]),
  );

  const store: Store<IAppState> =
    process.env.NODE_ENV === "production"
      ? createStore(reducers, middleware)
      : createStore(reducers, composeWithDevTools(middleware));

  // we have to create the dependencies here, because getState and dispatch get
  // injected in the middleware step above, maybe change this later
  context.deps = createGlobalDependencies(container);
  sagaMiddleware.run(rootSaga);

  return { store, container };
}

if (process.env.NF_ENABLE_TRANSLATE_OVERLAY) {
  const config = {
    projectId: process.env.NF_TRANSLATION_ID!,
    phraseEnabled: true,
    prefix: "[[__",
    suffix: "__]]",
  };
  initializePhraseAppEditor(config);
}

ga.installGA();

const history = createHistory();
const { store, container } = startupApp(history);
renderApp(store, history, container, hot(module)(App));
