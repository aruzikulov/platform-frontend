import { expect } from "chai";

import { applyDefaults } from "./utils";

describe("applyDefaults", () => {
  it("sets defaults if value is missing/undefined", () => {
    const data = { key1: "value", key2: 222, key3: null, key4: undefined };
    const defaults = {
      key2: "defaultValue 2",
      key3: "defaultValue 3",
      key4: "defaultValue 4",
      key5: "defaultValue 5",
    };
    const output = {
      key1: "value",
      key2: 222,
      key3: "defaultValue 3",
      key4: "defaultValue 4",
      key5: "defaultValue 5",
    };
    expect(applyDefaults(data, defaults)).to.deep.equal(output);
  });
});
