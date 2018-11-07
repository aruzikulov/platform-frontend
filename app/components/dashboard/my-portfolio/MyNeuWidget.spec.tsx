import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { MyNeuWidget } from "./MyNeuWidget";

import { tid } from "../../../../test/testUtils";

const fundsProps = {
  balanceNeu: "25.0045",
  balanceEur: "456.678",
};
const noFundsProps = {
  balanceNeu: "0",
};

describe("<MyNeuWidget />", () => {
  it("should load extended widget", () => {
    const MyNeuWidgetComponent = shallow(<MyNeuWidget {...fundsProps} />);

    expect(MyNeuWidgetComponent.find(tid("balance-neu"))).to.have.length(1);
  });

  it("should load simple widget", () => {
    const MyNeuWidgetComponent = shallow(<MyNeuWidget {...noFundsProps} />);

    expect(MyNeuWidgetComponent.find(tid("arrow-neu"))).to.have.length(1);
    expect(MyNeuWidgetComponent.find(tid("balance-neu"))).to.have.length(1);
  });
});
