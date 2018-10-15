import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { ECurrencySymbol, EMoneyFormat, Money } from "./Money";

describe("Money", () => {
  it("should format money from wei", () => {
    const component = shallow(<Money value={"1234567" + "0".repeat(16)} currency="eth" />);

    expect(component.text()).to.be.eq("12 345.6700 ETH");
  });

  it("should not add thousand separator format money", () => {
    const component = shallow(
      <Money value={"1234567" + "0".repeat(16)} currency="eth" doNotSeparateThousands />,
    );

    expect(component.text()).to.be.eq("12345.6700 ETH");
  });

  it("should not format money when format is set to FLOAT", () => {
    const component = shallow(<Money value={"250"} currency="eur" format={EMoneyFormat.FLOAT} />);

    expect(component.text()).to.be.eq("250 EUR");
  });

  it("should use currency symbol for eur", () => {
    const component = shallow(
      <Money
        value={"123456" + "0".repeat(16)}
        currency="eur"
        currencySymbol={ECurrencySymbol.SYMBOL}
      />,
    );

    expect(component.text()).to.be.eq("€1 234.56");
  });

  it("should not add either currency symbol or code  ", () => {
    const component = shallow(
      <Money
        value={"123456" + "0".repeat(16)}
        currency="eur"
        currencySymbol={ECurrencySymbol.NONE}
      />,
    );

    expect(component.text()).to.be.eq("1 234.56");
  });
});
