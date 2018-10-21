import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { SwitchConnected } from "../../shared/connectedRouting";
import { LoginHelp } from "./LoginHelp";
import { recoverRoutes } from "./recoverRoutes";
import { RecoverWallet } from "./RecoverWallet";
import { RecoverySuccess } from "./RecoverySuccess";

export const RecoverRouter: React.SFC = () => {
  return (
    <SwitchConnected>
      <Route path={recoverRoutes.help} component={LoginHelp} />
      <Route path={recoverRoutes.seed} component={RecoverWallet} />
      <Route path={recoverRoutes.success} component={RecoverySuccess} />
      <Redirect to={recoverRoutes.help} />
    </SwitchConnected>
  );
};
