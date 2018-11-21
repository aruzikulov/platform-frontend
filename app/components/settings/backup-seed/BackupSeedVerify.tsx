import * as Mnemonic from "bitcore-mnemonic";
import * as cn from "classnames";
import { range } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import Select from "react-virtualized-select";
import { Col, Row } from "reactstrap";
import { pure } from "recompose";
import { Button, EButtonLayout } from "../../shared/buttons";
import { WarningAlert } from "../../shared/WarningAlert";

import * as arrowLeft from "../../../assets/img/inline_icons/arrow_left.svg";
import * as styles from "./BackupSeedVerify.module.scss";

/* tslint:disable: no-submodule-imports */
import "react-select/dist/react-select.css";
import "react-virtualized-select/styles.css";
import "react-virtualized/styles.css";
/* tslint:enable: no-submodule-imports */

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

interface IBackupSeedVerifyComponentProps {
  onNext: () => void;
  onBack: () => void;
  updateValueFactory: (wordPageNumber: number) => (val: any) => void;
  verificationWords: IVerificationWord[];
  allWordsAreValid: boolean;
  isInvalid: boolean;
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

export const BackupSeedVerifyComponent: React.ComponentType<IBackupSeedVerifyComponentProps> = pure(
  ({
    onNext,
    onBack,
    updateValueFactory,
    verificationWords,
    allWordsAreValid,
    isInvalid,
  }: IBackupSeedVerifyComponentProps) => {
    const verificationSelectRefs: React.RefObject<Select>[] = [];

    const focusNext = (current: number) => {
      if (current + 1 < WORDS_TO_VERIFY) {
        // Typings are not up to date. Below is the link to method in case of any error.
        // https://github.com/bvaughn/react-virtualized-select/blob/b24fb1d59777d0d50cdb77b41a72cca1b58e0c00/source/VirtualizedSelect/VirtualizedSelect.js#L44
        const nextSelectRef = verificationSelectRefs[current + 1] as any;
        if (nextSelectRef.current) {
          nextSelectRef.current.focus();
        }
      }
    };

    const getValidationStyle = (wordOnPageNumber: number): string => {
      const validationWord = verificationWords[wordOnPageNumber];
      if (validationWord.isValid === undefined) {
        return "";
      } else {
        return validationWord.isValid === true ? styles.valid : styles.invalid;
      }
    };

    return (
      <>
        <Row>
          <Col xs={{ size: 10, offset: 1 }}>
            <Row>
              {range(0, WORDS_TO_VERIFY).map((num, wordPageNumber) => {
                const wordNumber = verificationWords[wordPageNumber].number;
                verificationSelectRefs.push(React.createRef());
                const onChange = updateValueFactory(wordPageNumber);
                return (
                  <Col
                    xs={{ size: 6, offset: 3 }}
                    sm={{ size: 3, offset: 0 }}
                    key={num}
                    className="my-4"
                  >
                    <div data-test-id="seed-verify-label">{`word ${wordNumber + 1}`}</div>
                    <div data-test-id={`backup-seed-verify-word-${wordPageNumber}`}>
                      <Select
                        options={wordsOptions}
                        simpleValue
                        clearable={true}
                        matchPos="start"
                        matchProp="value"
                        ref={verificationSelectRefs[wordPageNumber] as any} //Typings are not up to date
                        value={verificationWords[wordPageNumber].word}
                        onChange={v => {
                          focusNext(wordPageNumber);
                          onChange(v);
                        }}
                        placeholder={
                          <FormattedMessage id="settings.backup-seed-verify.enter-word" />
                        }
                        noResultsText={
                          <FormattedMessage id="settings.backup-seed-verify.no-matching-words" />
                        }
                        className={getValidationStyle(wordPageNumber)}
                      />
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
        {allWordsAreValid && (
          <div className={cn(styles.placeholderHeight, styles.row, styles.center)}>
            <Button data-test-id="seed-verify-button-next" onClick={onNext}>
              <FormattedMessage id="form.button.continue" />
            </Button>
          </div>
        )}
        {isInvalid && (
          <WarningAlert
            data-test-id="seed-verify-invalid-msg"
            className={cn(styles.placeholderHeight)}
          >
            <FormattedMessage id="settings.backup-seed-verify.recheck-words-message" />
          </WarningAlert>
        )}
        <div className={cn(styles.row)}>
          <Button
            layout={EButtonLayout.SECONDARY}
            iconPosition="icon-before"
            svgIcon={arrowLeft}
            onClick={onBack}
          >
            <FormattedMessage id="form.button.back" />
          </Button>
        </div>
      </>
    );
  },
);

class BackupSeedVerify extends React.Component<IBackupSeedVerifyProps, IBackupSeedVerifyState> {
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

    this.setState(state => ({
      verificationWords: state.verificationWords.map(
        (word, index) => (wordOnPageNumber === index ? verificationWord : word),
      ),
    }));
  };

  isValid = (): boolean => {
    return this.state.verificationWords.every(word => !!word.isValid);
  };

  isInvalid = (): boolean => {
    return this.state.verificationWords.some(word => word.isValid === false);
  };

  render(): React.ReactNode {
    return (
      <BackupSeedVerifyComponent
        onNext={this.props.onNext}
        onBack={this.props.onBack}
        updateValueFactory={this.updateValueFactory}
        verificationWords={this.state.verificationWords}
        allWordsAreValid={this.isValid()}
        isInvalid={this.isInvalid()}
      />
    );
  }
}

export { BackupSeedVerify };
