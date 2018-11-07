import { storiesOf } from "@storybook/react";
import * as React from "react";

import { IcbmWalletBalanceComponent } from "./IcbmWalletBalanceModal";

export const dummyEthereumAddress = "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359";

const walletMigrationMockData = {
  smartContractAddress: "0xab6916095cd1df60bb79ce92ce3ea74c37c5d359",
  migrationInputData: "0x0000",
  gasLimit: "40000",
  value: "0",
};

storiesOf("ICBMWalletModalComponant", module)
  .add("Missing Verifications", () => (
    <IcbmWalletBalanceComponent
      isOpen={true}
      isVerificationFullyDone={false}
      lockedWalletConnected={false}
      onCancel={() => {}}
      onGotoWallet={() => {}}
      ethAddress={dummyEthereumAddress}
      isLoading={false}
      neumarksDue="0.0"
      etherBalance="1.1"
    />
  ))
  .add("With All verifications Step 1", () => (
    <IcbmWalletBalanceComponent
      isOpen={true}
      isVerificationFullyDone={true}
      lockedWalletConnected={false}
      onCancel={() => {}}
      onGotoWallet={() => {}}
      ethAddress={dummyEthereumAddress}
      isLoading={false}
      neumarksDue="0.0"
      etherBalance="1.1"
      walletMigrationData={{ ...walletMigrationMockData, migrationStep: 1 }}
    />
  ))
  .add("With All verifications Step 2", () => (
    <IcbmWalletBalanceComponent
      isOpen={true}
      isVerificationFullyDone={true}
      lockedWalletConnected={false}
      onCancel={() => {}}
      onGotoWallet={() => {}}
      ethAddress={dummyEthereumAddress}
      isLoading={false}
      neumarksDue="0.0"
      etherBalance="1.1"
      walletMigrationData={{ ...walletMigrationMockData, migrationStep: 2 }}
    />
  ))
  .add("With All verifications Success", () => (
    <IcbmWalletBalanceComponent
      isOpen={true}
      isVerificationFullyDone={true}
      lockedWalletConnected={true}
      onCancel={() => {}}
      onGotoWallet={() => {}}
      ethAddress={dummyEthereumAddress}
      isLoading={false}
      neumarksDue="0.0"
      etherBalance="1.1"
      walletMigrationData={{ ...walletMigrationMockData, migrationStep: 2 }}
    />
  ))
  .add("Wallet Loading", () => (
    <IcbmWalletBalanceComponent
      isOpen={true}
      isVerificationFullyDone={true}
      lockedWalletConnected={false}
      onCancel={() => {}}
      onGotoWallet={() => {}}
      ethAddress={dummyEthereumAddress}
      isLoading={false}
      neumarksDue="0.0"
      etherBalance="1.1"
    />
  ));
