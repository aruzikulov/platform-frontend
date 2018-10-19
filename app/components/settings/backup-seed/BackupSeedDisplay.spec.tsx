import { expect } from "chai";
import { shallow } from "enzyme";
import { noop } from "lodash";
import * as React from "react";

import { tid } from "../../../../test/testUtils";
import { BackupSeedDisplay } from "./BackupSeedDisplay";

const words = [
  "word1",
  "word2",
  "word3",
  "word4",
  "word5",
  "word6",
  "word7",
  "word8",
  "word9",
  "word10",
  "word11",
  "word12",
  "word13",
  "word14",
  "word15",
  "word16",
  "word17",
  "word18",
  "word19",
  "word20",
  "word21",
  "word22",
  "word23",
  "word24",
];

describe("<BackupSeedDisplay />", () => {
  it("should render first half of words", () => {
    const component = shallow(
      <BackupSeedDisplay pageNo={0} onBack={noop} onNext={noop} words={words} />,
    );

    const renderedWords: string[] = [];
    component.find(tid("seed-display-word")).forEach(node => {
      renderedWords.push(node.childAt(1).text());
    });

    for (let index = 0; index < words.length / 2; index++) {
      expect(
        renderedWords[index].includes(words[index]),
        `rendered word: ${renderedWords[index]} doesn't include: ${words[index]}`,
      ).to.be.true;
    }
  });

  it("should render second half of words", () => {
    const component = shallow(
      <BackupSeedDisplay pageNo={1} onBack={noop} onNext={noop} words={words} />,
    );

    const renderedWords: string[] = [];
    component.find(tid("seed-display-word")).forEach(node => {
      renderedWords.push(node.childAt(1).text());
    });

    for (let index = 0; index < words.length / 2; index++) {
      expect(
        renderedWords[index].includes(words[index + words.length / 2]),
        `rendered word: ${renderedWords[index]} doesn't include: ${words[index]}`,
      ).to.be.true;
    }
  });

  it("previous button should be disabled on first page", () => {
    const component = shallow(
      <BackupSeedDisplay pageNo={0} onBack={noop} onNext={noop} words={words} />,
    );

    expect(component.find(tid("seed-display-prev-words")).prop("disabled")).to.be.true;
  });

  it("Next button should not be disabled on next page", () => {
    const component = shallow(
      <BackupSeedDisplay pageNo={1} onBack={noop} onNext={noop} words={words} />,
    );
    expect(component.find(tid("seed-display-prev-words")).prop("disabled")).to.be.false;
  });

  it("should not render next 12 words button on last page but and show next link", () => {
    const component = shallow(
      <BackupSeedDisplay pageNo={1} onBack={noop} onNext={noop} words={words} />,
    );

    expect(component.find(tid("seed-display-next-words"))).to.have.length(0);
    expect(component.find(tid("seed-display-next-link"))).to.have.length(1);
  });
});
