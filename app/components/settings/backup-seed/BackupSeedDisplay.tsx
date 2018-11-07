import * as cn from "classnames";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { Button, EButtonLayout } from "../../shared/buttons";

import * as styles from "./BackupSeedDisplay.module.scss";

import { FormattedMessage } from "react-intl-phraseapp";
import * as arrowLeft from "../../../assets/img/inline_icons/arrow_left.svg";

export const WORDS_PER_PAGE = 12;

interface IBackupSeedDisplayProps {
  onNext: () => void;
  onBack: () => void;
  words: string[];
  isModal?: boolean;
  pageNo: number;
}
export const BackupSeedDisplay: React.SFC<IBackupSeedDisplayProps> = ({
  words,
  isModal,
  pageNo,
  onNext,
  onBack,
}) => {
  const wordsNo = words.length;
  const startWord = WORDS_PER_PAGE * pageNo;
  const endWord = startWord + WORDS_PER_PAGE;
  const showNextButton = endWord >= wordsNo;

  return (
    <>
      <Row>
        <Col xs={{ size: 10, offset: 1 }}>
          <Row className="no-gutters">
            <Col className={cn("text-right", styles.pageStatus)}>
              {`${(pageNo + 1) * WORDS_PER_PAGE} / ${wordsNo}`}
            </Col>
          </Row>

          <Row className="justify-content-around no-gutters">
            {words.slice(startWord, endWord).map((word, index) => (
              <Col
                className={cn(styles.word, "mt-1 p-2 text-center")}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                key={index}
                data-test-id="seed-display-word"
              >
                {`${pageNo * WORDS_PER_PAGE + index + 1}.`}
                {isModal ? <div>{word}</div> : word}
              </Col>
            ))}
          </Row>

          <Row className="my-4 justify-content-center justify-content-sm-between">
            <Col className="mt-2" xs="auto">
              <Button
                data-test-id="seed-display-prev-words"
                disabled={pageNo === 0}
                onClick={onBack}
              >
                <FormattedMessage
                  id="settings.backup-seed-display.previous-words"
                  values={{ wordNumber: WORDS_PER_PAGE }}
                />
              </Button>
            </Col>
            <Col className="mt-2" xs="auto">
              {!isModal && onNext && showNextButton ? (
                <Button data-test-id="seed-display-next-link" onClick={onNext}>
                  <FormattedMessage id="form.button.continue" />
                </Button>
              ) : (
                <Button
                  data-test-id="seed-display-next-words"
                  disabled={pageNo === 1}
                  onClick={onNext}
                >
                  <FormattedMessage
                    id="settings.backup-seed-display.next-words"
                    values={{ wordNumber: WORDS_PER_PAGE }}
                  />
                </Button>
              )}
            </Col>
          </Row>
        </Col>
      </Row>

      {!isModal && (
        <Row>
          <Col>
            <Button
              layout={EButtonLayout.SECONDARY}
              iconPosition="icon-before"
              svgIcon={arrowLeft}
              onClick={onBack}
            >
              <FormattedMessage id="form.button.back" />
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};
