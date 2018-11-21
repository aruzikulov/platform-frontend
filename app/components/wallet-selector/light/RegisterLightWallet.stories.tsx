import { storiesOf } from "@storybook/react";
import * as React from "react";

import { RegisterWalletComponent } from "./RegisterLightWallet";

const testData = {
  submitForm: () => {},
  isLoading: false,
  errorMsg: "",
};

storiesOf("Wallet selector/LightWallet", module)
  .add("default", () => {
    const data = { ...testData, restore: false };
    return <RegisterWalletComponent {...data} />;
  })
  .add("restore", () => {
    const data = { ...testData, restore: true };
    return <RegisterWalletComponent {...data} />;
  });
