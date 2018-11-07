import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import * as arrowLeft from "../../../assets/img/inline_icons/arrow_left.svg";
import * as noComputer from "../../../assets/img/seed_backup/no_computer.svg";
import * as safe from "../../../assets/img/seed_backup/safe.svg";
import * as write from "../../../assets/img/seed_backup/write.svg";
import { Button, EButtonLayout } from "../../shared/buttons";
import { StepCard } from "../../shared/StepCard";

interface IBackupSeedIntroProps {
  onNext: () => void;
  onBack: string;
}

export const BackupSeedIntro: React.SFC<IBackupSeedIntroProps> = ({ onBack, onNext }) => (
  <>
    <Row className="mb-4 text-center">
      <StepCard
        img={write}
        text={<FormattedMessage id="settings.backup-seed-intro.write-all-words" />}
      />
      <StepCard
        img={noComputer}
        text={<FormattedMessage id="settings.backup-seed-intro.words-warning" />}
      />
      <StepCard
        img={safe}
        text={<FormattedMessage id="settings.backup-seed-intro.store-safely" />}
      />
    </Row>
    <Row className="my-5">
      <Col className="text-center">
        <Button onClick={onNext} data-test-id="backup-seed-intro-button">
          <FormattedMessage id="settings.backup-seed-intro.read-instructions" />
        </Button>
      </Col>
    </Row>
    <Row>
      <Col className="col-auto">
        <Button
          layout={EButtonLayout.SECONDARY}
          iconPosition="icon-before"
          svgIcon={arrowLeft}
          onClick={() => onBack}
        >
          <FormattedMessage id="form.button.back" />
        </Button>
      </Col>
    </Row>
  </>
);
