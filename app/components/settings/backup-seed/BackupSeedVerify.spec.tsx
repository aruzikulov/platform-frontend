import * as Mnemonic from "bitcore-mnemonic";
import { expect } from "chai";
import { shallow } from "enzyme";
import { difference, noop } from "lodash";
import * as React from "react";

import { tid } from "../../../../test/testUtils";
import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import { BackupSeedVerifyComponent, IBackupSeedVerifyState } from "./BackupSeedVerify";

const words = Mnemonic.Words.ENGLISH.slice(0, 24);

describe("<BackupSeedVerify />", () => {
  it("should render word selectors with correct labels", () => {
    const component = shallow(
      <BackupSeedVerifyComponent words={words} onBack={noop} onNext={noop} intl={dummyIntl} />,
    );

    const wordsToCheck = (component.state() as IBackupSeedVerifyState).verificationWords.map(
      word => word.number,
    );
    const re = /\d+/;
    const labels = component.find(tid("seed-verify-label")).map(node => {
      const match = re.exec(node.text());
      if (match !== null) {
        return Number.parseInt(match[0], 10) - 1;
      } else {
        throw Error("BackupSeedVerify doesn't contain correct text labels");
      }
    });

    expect(
      difference(wordsToCheck, labels),
      "labels doesn't correspond to words selected for check",
    ).to.have.lengthOf(0);
  });

  it("shouldn't show incorrect validation msg nor continue button without entered words", () => {
    const component = shallow(
      <BackupSeedVerifyComponent words={words} onBack={noop} onNext={noop} intl={dummyIntl} />,
    );

    expect(component.find(tid("seed-verify-invalid-msg"))).to.have.lengthOf(0);
    expect(component.find(tid("seed-verify-button-next"))).to.have.lengthOf(0);
  });

  it("shouldn't show incorrect validation msg nor continue button when there is one correct word", () => {
    const component = shallow(
      <BackupSeedVerifyComponent words={words} onBack={noop} onNext={noop} intl={dummyIntl} />,
    );
    const state = {
      verificationWords: [
        { number: 0, word: words[0] },
        { number: 1, word: "" },
        { number: 2, word: "" },
        { number: 3, word: "" },
      ],
    };

    component.setState(state);

    expect(component.find(tid("seed-verify-invalid-msg"))).to.have.lengthOf(0);
    expect(component.find(tid("seed-verify-button-next"))).to.have.lengthOf(0);
  });

  it("should show continue button when all words are correct", () => {
    const component = shallow(
      <BackupSeedVerifyComponent words={words} onBack={noop} onNext={noop} intl={dummyIntl} />,
    );
    const state = {
      verificationWords: [
        { number: 0, word: words[0] },
        { number: 1, word: words[1] },
        { number: 2, word: words[2] },
        { number: 3, word: words[3] },
      ],
    };
    component.setState(state);

    expect(component.find(tid("seed-verify-invalid-msg"))).to.have.lengthOf(0);
    expect(component.find(tid("seed-verify-button-next"))).to.have.lengthOf(1);
  });

  it("should show continue validation msg when incorrect word was selected", () => {
    const component = shallow(
      <BackupSeedVerifyComponent words={words} onBack={noop} onNext={noop} intl={dummyIntl} />,
    );
    const state = {
      verificationWords: [
        { number: 0, word: words[6] },
        { number: 1, word: "" },
        { number: 2, word: "" },
        { number: 3, word: "" },
      ],
    };

    component.setState(state);

    expect(component.find(tid("seed-verify-invalid-msg"))).to.have.lengthOf(1);
    expect(component.find(tid("seed-verify-button-next"))).to.have.lengthOf(0);
  });
});
