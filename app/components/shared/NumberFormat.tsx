import BigNumber from "bignumber.js";
import * as React from "react";

import { formatThousands } from "../../utils/Number.utils";

interface IProps {
  value: string | number | BigNumber;
}

const NumberFormat: React.SFC<IProps> = ({ value }) => {
  return <>{formatThousands(`${value}`)}</>;
};

export { NumberFormat };
