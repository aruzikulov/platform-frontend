import "react-select/dist/react-select.css";
import "react-virtualized-select/styles.css";
import "react-virtualized/styles.css";

import * as Mnemonic from "bitcore-mnemonic";
import { range } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import Select from "react-virtualized-select";
import { Col, Row } from "reactstrap";

import { Button } from "../../shared/buttons";
import { HeaderProgressStepper } from "../../shared/HeaderProgressStepper";

export const SEED_LENGTH = 24;
const WORDS_PER_VIEW = 4;
const wordsOptions = Mnemonic.Words.ENGLISH.map((word: string) => ({ value: word, label: word }));

interface ISeedRecoveryProps {
  startingStep: number;
  extraSteps: number;
  sendWords: (words: string) => void;
}

interface ISeedRecoveryState {
  words: string[];
  page: number;
}

export class WalletLightSeedRecoveryComponent extends React.Component<
  ISeedRecoveryProps,
  ISeedRecoveryState
> {
  constructor(props: ISeedRecoveryProps) {
    super(props);

    this.state = {
      words: Array(SEED_LENGTH).fill(null),
      page: 0,
    };
  }

  updateValueFactory = (wordNumber: number) => (newValue: any): void => {
    const words = this.state.words;
    words[wordNumber] = newValue;
    this.setState({
      words,
    });
  };

  generateSelect = (wordNumber: number): React.ReactNode => (
    <div data-test-id={`seed-recovery-word-${wordNumber}`}>
      <Select
        options={wordsOptions}
        simpleValue
        clearable={true}
        matchPos="start"
        matchProp="value"
        value={this.state.words[wordNumber]}
        onChange={this.updateValueFactory(wordNumber)}
        placeholder={(wordNumber + 1).toString(10) + ". Word"}
        noResultsText="No matching word"
      />
    </div>
  );

  handleNextView = () => {
    this.setState({
      page: this.state.page + 1,
    });
  };

  handlePreviousView = () => {
    if (this.state.page > 0) {
      this.setState({
        page: this.state.page - 1,
      });
    }
  };

  handleSendWords = () => {
    this.props.sendWords(this.state.words.join(" "));
  };

  render(): React.ReactNode {
    const startIndex = this.state.page * WORDS_PER_VIEW;
    const endIndex = startIndex + WORDS_PER_VIEW;

    const canAdvance = this.state.words
      .slice(startIndex, endIndex)
      .reduce((acc: boolean, value: string): boolean => {
        return acc && value !== null;
      }, true);

    const canSubmit = this.state.words.reduce((acc: boolean, value: string): boolean => {
      return acc && value !== null;
    }, true);

    return (
      <>
        <Col className="mt-4 pb-4">
          <HeaderProgressStepper
            headerText={<FormattedMessage id="wallet-selector.recover.seed.header" />}
            descText={<FormattedMessage id="wallet-selector.recover.seed.recover-description" />}
            currentStep={this.props.startingStep + this.state.page + 1}
            steps={this.props.extraSteps + SEED_LENGTH / WORDS_PER_VIEW}
          />
        </Col>
        <Row className="my-2">
          <Col className="text-center">
            {this.state.words.filter(word => word !== null).join(" , ")}
          </Col>
        </Row>
        <Row>
          {range(startIndex, endIndex).map(num => (
            <Col xs={{ size: 6, offset: 3 }} sm={{ size: 3, offset: 0 }} key={num} className="my-3">
              {this.generateSelect(num)}
            </Col>
          ))}
        </Row>
        <Row className="d-flex justify-content-between my-3">
          <Button
            data-test-id="btn-previous"
            disabled={startIndex === 0}
            onClick={this.handlePreviousView}
          >
            <FormattedMessage id="wallet-selector.recovery.seed.previous-words" />
          </Button>
          {this.state.page + 1 < SEED_LENGTH / WORDS_PER_VIEW && (
            <Button data-test-id="btn-next" disabled={!canAdvance} onClick={this.handleNextView}>
              <FormattedMessage
                id="wallet-selector.recovery.seed.next-words"
                values={{ words: `${endIndex} / ${SEED_LENGTH}` }}
              />
            </Button>
          )}
        </Row>
        <Row className="text-center my-3">
          <Col>
            <Button data-test-id="btn-send" disabled={!canSubmit} onClick={this.handleSendWords}>
              <FormattedMessage id="wallet-selector.recovery.seed.send-words-button" />
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}
