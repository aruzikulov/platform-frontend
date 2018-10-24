import * as React from "react";

import { LoadingIndicator } from "../../../shared/LoadingIndicator";

export const WatchPendingTxs = () => (
  <>
    <h3>There are external pending transactions. Please wait...</h3>
    <LoadingIndicator />
  </>
);
