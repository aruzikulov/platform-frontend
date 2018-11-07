import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { ECurrencySymbol, EMoneyFormat, Money } from "./Money";

describe("Money", () => {
  it("should format money from wei", () => {
    const component = shallow(<Money value={"1234567" + "0".repeat(16)} currency="eth" />);

    expect(component.render().text()).to.be.eq("12 345.6700 ETH");
  });

  it("should not add thousand separator format money", () => {
    const component = shallow(
      <Money value={"1234567" + "0".repeat(16)} currency="eth" doNotSeparateThousands />,
    );

    expect(component.render().text()).to.be.eq("12345.6700 ETH");
  });

  it("should format money when format is set to FLOAT", () => {
    const component = shallow(
      <Money value={"2501234"} currency="eur" format={EMoneyFormat.FLOAT} />,
    );

    expect(component.render().text()).to.be.eq("2 501 234 EUR");
  });

  it("should use currency symbol for eur", () => {
    const component = shallow(
      <Money
        value={"123456" + "0".repeat(16)}
        currency="eur"
        currencySymbol={ECurrencySymbol.SYMBOL}
      />,
    );

    expect(component.render().text()).to.be.eq("€1 234.56");
  });

  it("should not add either currency symbol or code  ", () => {
    const component = shallow(
      <Money
        value={"123456" + "0".repeat(16)}
        currency="eur"
        currencySymbol={ECurrencySymbol.NONE}
      />,
    );

    expect(component.render().text()).to.be.eq("1 234.56");
  });

  it("should output - when no value is provided", () => {
    const component = shallow(<Money currency="eur" />);
    expect(component.text()).to.be.eq("-");
  });

  it("should not add thousands separator if value is React.element type", () => {
    const value = <React.Fragment>1234567</React.Fragment>;
    const component = shallow(
      <Money value={value} currency="eur" currencySymbol={ECurrencySymbol.NONE} />,
    );

    expect(component.render().text()).to.be.eq("1234567");
  });

  it("should format eur_token currency", () => {
    const component = shallow(<Money value={"123456" + "0".repeat(16)} currency="eur_token" />);

    expect(component.render().text()).to.be.eq("1 234.56 nEUR");
  });

  it("should throw error for non existing currency symbol", () => {
    const componentMount = () =>
      shallow(
        <Money
          value={"123456" + "0".repeat(16)}
          currency="eur_token"
          currencySymbol={ECurrencySymbol.SYMBOL}
        />,
      );

    expect(componentMount).to.throw("Only EUR can be displayed as a symbol");
  });
});
