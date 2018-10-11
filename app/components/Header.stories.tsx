import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EUserType } from "../lib/api/users/interfaces";
import { HeaderComponent } from "./Header";

storiesOf("Layout/Header", module)
  .add("investor", () => (
    <>
      <HeaderComponent
        isAuthorized={false}
        logout={() => {}}
        location={"foo"}
        userType={EUserType.INVESTOR}
      />
      <br />
      <HeaderComponent
        isAuthorized={true}
        logout={() => {}}
        location={"foo"}
        userType={EUserType.INVESTOR}
      />
    </>
  ))
  .add("issuer", () => (
    <>
      <HeaderComponent
        isAuthorized={false}
        logout={() => {}}
        location={"foo"}
        userType={EUserType.ISSUER}
      />
      <br />
      <HeaderComponent
        isAuthorized={true}
        logout={() => {}}
        location={"foo"}
        userType={EUserType.ISSUER}
      />
    </>
  ));
