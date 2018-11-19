import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Provider } from "react-redux";

import { LoginLightWallet } from "./LoginLightWallet";

const store: any = {
  dispatch: () => {},
  subscribe: () => {},
  getState: () => store.state,
  state: {
    router: {
      location: {
        pathname: "",
        search: "",
        hash: "",
      },
    },
    web3: {
      previousConnectedWallet: null,
    },
    lightWalletWizard: {
      errorMsg: undefined,
      isLoading: false,
    },
  },
};

storiesOf("LoginLightWallet", module)
  .addDecorator(story => <Provider store={store}>{story()}</Provider>)
  .add("Without email set", () => {
    store.state = {
      ...store.state,
      router: {
        location: {
          pathname: "",
          search: "",
        },
      },
    };

    return <LoginLightWallet />;
  })
  .add("With valid mail set", () => {
    store.state = {
      ...store.state,
      router: {
        location: {
          pathname: "/login/light",
          search: "?email=mail@neufund.org&salt=salt&user_type=investor",
        },
      },
    };
    return <LoginLightWallet />;
  })
  .add("With invalid mail set", () => {
    store.state = {
      ...store.state,
      router: {
        location: {
          pathname: "/login/light",
          search: '?email=not+a+mail"neufund.org&salt=salt&user_type=investor',
        },
      },
    };
    return <LoginLightWallet />;
  });
