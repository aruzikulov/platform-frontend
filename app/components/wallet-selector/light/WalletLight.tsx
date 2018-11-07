import * as React from "react";
import { Container } from "reactstrap";

import { selectIsLoginRoute } from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { LoginLightWallet } from "./LoginLightWallet";
import { RegisterLightWallet } from "./RegisterLightWallet";

interface IStateProps {
  isLoginRoute: boolean;
}

export const WalletLightComponent: React.SFC<IStateProps> = ({ isLoginRoute }) => (
  <Container>{isLoginRoute ? <LoginLightWallet /> : <RegisterLightWallet />}</Container>
);

export const WalletLight = appConnect<IStateProps>({
  stateToProps: s => ({
    isLoginRoute: selectIsLoginRoute(s.router),
  }),
})(WalletLightComponent);
