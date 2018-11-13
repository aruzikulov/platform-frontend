import { storiesOf } from "@storybook/react";
import * as React from "react";
import { UnlockedWallet } from "./UnlockedWallet";

storiesOf("Unlocked Wallet", module)
  .add("Normal Wallet", () => (
    <UnlockedWallet
      depositEth={() => {}}
      withdrawEth={() => {}}
      address="0x"
      data={{
        ethAmount: "0",
        ethEuroAmount: "0",
        neuroAmount: "0",
        neuroEuroAmount: "0",
        totalEuroAmount: "0",
      }}
    />
  ))
  .add("With Eth only", () => (
    <UnlockedWallet
      depositEth={() => {}}
      withdrawEth={() => {}}
      address="0x"
      data={{
        ethAmount: "1",
        ethEuroAmount: "1",
        neuroAmount: "0",
        neuroEuroAmount: "0",
        totalEuroAmount: "0",
      }}
    />
  ))
  .add("With Euro only", () => (
    <UnlockedWallet
      depositEth={() => {}}
      withdrawEth={() => {}}
      address="0x"
      data={{
        ethAmount: "0",
        ethEuroAmount: "0",
        neuroAmount: "1",
        neuroEuroAmount: "1",
        totalEuroAmount: "0",
      }}
    />
  ))
  .add("With Both Values", () => (
    <UnlockedWallet
      depositEth={() => {}}
      withdrawEth={() => {}}
      address="0x"
      data={{
        ethAmount: "1",
        ethEuroAmount: "1",
        neuroAmount: "1",
        neuroEuroAmount: "1",
        totalEuroAmount: "0",
      }}
    />
  ));
