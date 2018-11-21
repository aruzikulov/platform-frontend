/* tslint:disable: no-submodule-imports */
import "react-select/dist/react-select.css";
import "react-virtualized-select/styles.css";
import "react-virtualized/styles.css";
/* tslint:enable: no-submodule-imports */

import * as Mnemonic from "bitcore-mnemonic";
import { range } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import Select from "react-virtualized-select";
import { Col, Row } from "reactstrap";

import { TElementRef } from "../../../types";
import { Button, EButtonLayout } from "../../shared/buttons";
import { WarningAlert } from "../../shared/WarningAlert";

import * as arrowLeft from "../../../assets/img/inline_icons/arrow_left.svg";
import * as styles from "./BackupSeedVerify.module.scss";

const WORDS_TO_VERIFY = 4;

const wordsOptions = Mnemonic.Words.ENGLISH.map((word: string) => ({ value: word, label: word }));

interface IBackupSeedVerifyProps {
  onNext: () => void;
  onBack: () => void;
  words: string[];
}

interface IVerificationWord {
  number: number;
  word: string;
  isValid: boolean | undefined;
}

export interface IBackupSeedVerifyState {
  verificationWords: IVerificationWord[];
}

// here it's good enough
const getRandomNumbers = (numbers: number, range: number): number[] => {
  const arr = [];
  while (arr.length < numbers) {
    const randomNumber = Math.floor(Math.random() * range);
    if (arr.indexOf(randomNumber) > -1) continue;
    arr[arr.length] = randomNumber;
  }
  return arr.sort((a, b) => a - b);
};

class BackupSeedVerify extends React.Component<IBackupSeedVerifyProps, IBackupSeedVerifyState> {
  verificationSelectRefs: TElementRef<Select>[] = [];

  constructor(props: IBackupSeedVerifyProps) {
    super(props);

    const wordsToCheck = getRandomNumbers(WORDS_TO_VERIFY, props.words.length);

    this.state = {
      verificationWords: wordsToCheck.map(number => ({
        number,
        word: "",
        isValid: undefined,
      })),
    };
  }

  updateValueFactory = (wordOnPageNumber: number) => (newValue: any): void => {
    const { number } = this.state.verificationWords[wordOnPageNumber];

    const verificationWord: IVerificationWord = {
      number,
      word: newValue,
      isValid: newValue === this.props.words[number],
    };

    this.setState(
      state => ({
        verificationWords: state.verificationWords.map(
          (word, index) => (wordOnPageNumber === index ? verificationWord : word),
        ),
      }),
      () => this.focusNext(wordOnPageNumber),
    );
  };

  focusNext = (current: number) => {
    if (current + 1 < WORDS_TO_VERIFY) {
      // Typings are not up to date. Below is the link to method in case of any error.
      // https://github.com/bvaughn/react-virtualized-select/blob/b24fb1d59777d0d50cdb77b41a72cca1b58e0c00/source/VirtualizedSelect/VirtualizedSelect.js#L44
      const nextSelectRef = this.verificationSelectRefs[current + 1] as any;

      if (nextSelectRef) {
        nextSelectRef.focus();
      }
    }
  };

  getValidationStyle = (wordOnPageNumber: number): string => {
    const validationWord = this.state.verificationWords[wordOnPageNumber];

    if (validationWord.isValid === true) {
      return styles.valid;
    }

    if (validationWord.isValid === false) {
      return styles.invalid;
    }

    return "";
  };

  isInvalid = (): boolean => {
    return this.state.verificationWords.some(word => word.isValid === false);
  };

  isValid = (): boolean => {
    return this.state.verificationWords.every(word => !!word.isValid);
  };

  generateSelect = (wordOnPageNumber: number): React.ReactNode => (
    <div data-test-id={`backup-seed-verify-word-${wordOnPageNumber}`}>
      <Select
        options={wordsOptions}
        simpleValue
        clearable={true}
        matchPos="start"
        matchProp="value"
        ref={(ref: TElementRef<Select>) => (this.verificationSelectRefs[wordOnPageNumber] = ref)}
        value={this.state.verificationWords[wordOnPageNumber].word}
        onChange={this.updateValueFactory(wordOnPageNumber)}
        placeholder={<FormattedMessage id="settings.backup-seed-verify.enter-word" />}
        noResultsText={<FormattedMessage id="settings.backup-seed-verify.no-matching-words" />}
        className={this.getValidationStyle(wordOnPageNumber)}
      />
    </div>
  );

  render(): React.ReactNode {
    return (
      <>
        <Row>
          <Col xs={{ size: 10, offset: 1 }}>
            <Row>
              {range(0, WORDS_TO_VERIFY).map((num, wordPageNumber) => {
                const wordNumber = this.state.verificationWords[wordPageNumber].number;
                return (
                  <Col
                    xs={{ size: 6, offset: 3 }}
                    sm={{ size: 3, offset: 0 }}
                    key={num}
                    className="my-4"
                  >
                    <div data-test-id="seed-verify-label">{`word ${wordNumber + 1}`}</div>
                    {this.generateSelect(num)}
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
        {this.isValid() && (
          <Row className="my-4 text-center">
            <Col className={styles.placeholderHeight}>
              <Button data-test-id="seed-verify-button-next" onClick={this.props.onNext}>
                <FormattedMessage id="form.button.continue" />
              </Button>
            </Col>
          </Row>
        )}
        {this.isInvalid() && (
          <Row className="my-4 justify-content-center">
            <WarningAlert
              data-test-id="seed-verify-invalid-msg"
              className={styles.placeholderHeight}
            >
              <FormattedMessage id="settings.backup-seed-verify.recheck-words-message" />
            </WarningAlert>
          </Row>
        )}
        <Row>
          <Col>
            <Button
              layout={EButtonLayout.SECONDARY}
              iconPosition="icon-before"
              svgIcon={arrowLeft}
              onClick={this.props.onBack}
            >
              <FormattedMessage id="form.button.back" />
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

export { BackupSeedVerify };
