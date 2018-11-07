import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ECurrencySymbol, Money } from "./Money";

const value = "1234567" + "0".repeat(18);

storiesOf("Money", module)
  .add("default (with currency code)", () => (
    <>
      <Money currency="eur" value={value} />
      <br />
      <Money currency="neu" value={value} />
      <br />
      <Money currency="eur_token" value={value} />
      <br />
      <Money currency="eth" value={value} />
    </>
  ))
  .add("with currency symbol", () => (
    <Money currency="eur" value={value} currencySymbol={ECurrencySymbol.SYMBOL} />
  ))
  .add("transfer", () => (
    <>
      <Money currency="eur" value={value} transfer="income" />
      <br />
      <Money currency="eur" value={value} transfer="outcome" />
    </>
  ))
  .add("no currency symbol", () => (
    <Money currency="eur" value={value} currencySymbol={ECurrencySymbol.NONE} />
  ))
  .add("themed", () => (
    <>
      <p>t-green</p>
      <Money currency="eur" value={value} theme="t-green" />
      <br />
      <p>t-orange</p>
      <Money currency="eth" value="20000000000000000" theme="t-orange" />
    </>
  ));
