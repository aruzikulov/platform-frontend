import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import {
  IWalletMigrationData,
  TWalletMigrationSteps,
} from "../../../modules/icbm-wallet-balance-modal/reducer";
import { myEtherWalletUrl } from "../../../utils/myEtherWallet";
import { ConfettiEthereum } from "../../landing/parts/ConfettiEthereum";
import { SpinningEthereum } from "../../landing/parts/SpinningEthereum";
import { ButtonArrowRight } from "../../shared/buttons/Button";
import { HighlightedStripField } from "../../shared/HighlightedStripField";
import { SectionHeader } from "../../shared/SectionHeader";

import { Col, Container, Row } from "reactstrap";
import * as iconMyEtherWallet from "../../../assets/img/myEtherWallet.svg";
import * as styles from "./IcbmWalletBalanceModal.module.scss";

interface IMigrationModal {
  walletMigrationData: IWalletMigrationData;
  migrationStep: TWalletMigrationSteps;
  success: boolean;
  onGotoWallet: () => void;
  goToNextStep: () => void;
}

enum ETransactionStatus {
  SUCCESS = "success",
  WAITING = "waiting",
}

const MigrateFooter: React.SFC<{
  transactionStatus: ETransactionStatus;
  onGotoWallet: () => void;
  step: number;
  gotoNextStep: () => void;
}> = ({ transactionStatus, onGotoWallet, step, gotoNextStep }) => {
  return (
    <Container>
      {transactionStatus === ETransactionStatus.WAITING && (
        <Row className={styles.footerWaiting}>
          <SpinningEthereum className={styles.animatedEthereum} />
          <FormattedMessage id="settings.modal.icbm-wallet-balance.footer.waiting-for-transaction" />
        </Row>
      )}
      {transactionStatus === ETransactionStatus.SUCCESS && (
        <Row className={styles.footerSuccess} noGutters>
          <Col xs="auto">
            <ConfettiEthereum className={styles.animatedEthereum} />
          </Col>
          <Col xs="auto">
            <Col>
              <FormattedMessage id="settings.modal.icbm-wallet-balance.footer.transaction-successful" />
            </Col>
            <Col>
              {step === 1 ? (
                <ButtonArrowRight
                  onClick={gotoNextStep}
                  data-test-id="modals.icbm-balance-modal.balance-footer.successful-transaction"
                  className="px-0"
                >
                  <FormattedMessage id="settings.modal.icbm-wallet-balance.button.go-to-next-step" />
                </ButtonArrowRight>
              ) : (
                <ButtonArrowRight
                  onClick={onGotoWallet}
                  className="px-0"
                  data-test-id="modals.icbm-balance-modal.balance-footer.successful-transaction"
                >
                  <FormattedMessage id="settings.modal.icbm-wallet-balance.button.wallet" />
                </ButtonArrowRight>
              )}
            </Col>
          </Col>
        </Row>
      )}
    </Container>
  );
};

const MigrateHeader: React.SFC<{ step: number }> = ({ step }) => (
  <>
    <p className={styles.description}>
      <FormattedHTMLMessage
        tagName="span"
        id="settings.modal.icbm-wallet-balance.body.migrate.description"
      />
    </p>
    {step === 1 && (
      <>
        <SectionHeader className={styles.header}>
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.step.1.title" />
        </SectionHeader>
        <p className={styles.description}>
          <FormattedHTMLMessage
            tagName="span"
            id="settings.modal.icbm-wallet-balance.body.migrate.step.1.description"
          />
        </p>
      </>
    )}
    {step === 2 && (
      <>
        <SectionHeader className={styles.header}>
          <div data-test-id="modals.icbm-balance-modal.migrate-body.step-2">
            <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.step.2.title" />
          </div>
        </SectionHeader>
        <p className={styles.description}>
          <FormattedHTMLMessage
            tagName="span"
            id="settings.modal.icbm-wallet-balance.body.migrate.step.2.description"
          />
        </p>
      </>
    )}
  </>
);

const MigrateBody: React.SFC<{
  walletMigrationData: IWalletMigrationData;
}> = ({ walletMigrationData }) => {
  return (
    <>
      <a
        target="_blank"
        href={myEtherWalletUrl(
          walletMigrationData.smartContractAddress,
          walletMigrationData.value,
          walletMigrationData.gasLimit,
          walletMigrationData.migrationInputData,
        )}
      >
        <HighlightedStripField
          icon={iconMyEtherWallet}
          label={<FormattedMessage id="settings.modal.icbm-wallet-balance.body.my-ether-wallet" />}
          whiteBackground={true}
        />
      </a>
      <HighlightedStripField
        label={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.to-smart-contract" />
        }
        value={walletMigrationData.smartContractAddress}
        withCopy
        dataTestId="modals.icbm-balance-modal.migrate-body.to"
      />
      <HighlightedStripField
        label={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.amount-to-sent" />
        }
        value={walletMigrationData.value}
        withCopy
        whiteBackground={true}
      />
      <HighlightedStripField
        label={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.gas-limit" />
        }
        value={walletMigrationData.gasLimit}
        withCopy
        dataTestId="modals.icbm-balance-modal.migrate-body.gas-limit"
      />
      <HighlightedStripField
        label={<FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.data" />}
        value={walletMigrationData.migrationInputData}
        withCopy
        whiteBackground={true}
        dataTestId="modals.icbm-balance-modal.migrate-body.input-data"
      />
    </>
  );
};

export const MigrateModal: React.SFC<IMigrationModal> = ({
  walletMigrationData,
  migrationStep,
  success,
  onGotoWallet,
  goToNextStep,
}) => {
  return (
    <>
      <SectionHeader className={styles.header}>
        <FormattedMessage id="settings.modal.icbm-wallet-balance.title.migrate" />
      </SectionHeader>

      <MigrateHeader step={migrationStep} />

      <MigrateBody walletMigrationData={walletMigrationData} />

      <MigrateFooter
        transactionStatus={success ? ETransactionStatus.SUCCESS : ETransactionStatus.WAITING}
        onGotoWallet={onGotoWallet}
        step={migrationStep}
        gotoNextStep={goToNextStep}
      />
    </>
  );
};
