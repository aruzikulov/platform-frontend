import { storiesOf } from "@storybook/react";
import * as React from "react";

import { noop } from "redux-saga/utils";
import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import { WalletBrowserComponent } from "./WalletBrowser";

storiesOf("Wallet selector/Browser", module)
  .add("initial loading state", () => (
    <WalletBrowserComponent
      isLoading={true}
      isLoginRoute
      intl={dummyIntl}
      approval_rejected={false}
      handleReset={noop}
    />
  ))
  .add("error message", () => (
    <WalletBrowserComponent
      isLoading={false}
      errorMessage={"Error message"}
      isLoginRoute
      intl={dummyIntl}
      approval_rejected={false}
      handleReset={noop}
    />
  ))
  .add("approval rejected", () => (
    <WalletBrowserComponent
      isLoading={false}
      errorMessage={"Error message"}
      isLoginRoute
      intl={dummyIntl}
      approval_rejected={true}
      handleReset={noop}
    />
  ));
