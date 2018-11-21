import { storiesOf } from "@storybook/react";
import * as React from "react";

import { BackupSeedVerifyComponent } from "./BackupSeedVerify";

const testWord0 = {
  number: 0,
  word: "",
  isValid: undefined,
};
const testWord1 = {
  number: 1,
  word: "",
  isValid: undefined,
};
const testWord2 = {
  number: 2,
  word: "",
  isValid: undefined,
};
const testWord3 = {
  number: 3,
  word: "",
  isValid: undefined,
};
const testWord4 = {
  number: 4,
  word: "",
  isValid: undefined,
};

const testData = {
  onNext: () => {},
  onBack: () => {},
  updateValueFactory: () => () => {},
  verificationWords: [testWord0, testWord1, testWord2, testWord3, testWord4],
};

storiesOf("BackupSeedVerify", module)
  .add("with button", () => (
    <BackupSeedVerifyComponent {...{ ...testData, isInvalid: false, allWordsAreValid: true }} />
  ))
  .add("with error", () => (
    <BackupSeedVerifyComponent {...{ ...testData, isInvalid: true, allWordsAreValid: false }} />
  ));
