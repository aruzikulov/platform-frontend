import * as cn from "classnames";
import { Form, Formik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { generateCampaigningValidation } from "../../../../../lib/api/eto/EtoPledgeApi.interfaces";
import { Button, ButtonSize, ButtonWidth } from "../../../../shared/buttons";
import { CheckboxComponent, FormInput, InputSize } from "../../../../shared/forms";
import { Tooltip } from "../../../../shared/Tooltip";

import * as styles from "../EtoOverviewStatus.module.scss";

export enum CampaigningFormState {
  VIEW,
  EDIT,
}

export interface ICampaigningActivatedInvestorWidgetLayoutProps {
  pledgedAmount: number | "";
  consentToRevealEmail: boolean;
  backNow: (amount: number) => void;
  formState: CampaigningFormState;
  showMyEmail: (consentToRevealEmail: boolean) => void;
  changePledge: () => void;
  deletePledge: () => void;
  minPledge: number;
  maxPledge?: number;
}

const CampaigningActivatedInvestorApprovedWidgetLayout: React.SFC<
  ICampaigningActivatedInvestorWidgetLayoutProps
> = ({
  pledgedAmount,
  consentToRevealEmail,
  backNow,
  formState,
  showMyEmail,
  changePledge,
  deletePledge,
  minPledge,
  maxPledge,
}) => {
  return (
    <>
      <div className={styles.group}>
        <label htmlFor="consentToRevealEmail" className={styles.label}>
          <FormattedMessage id="shared-component.eto-overview.reveal-my-email" />
          <Tooltip
            content={
              <FormattedMessage id="shared-component.eto-overview.reveal-my-email.tooltip" />
            }
          />
        </label>
        <div className={styles.value}>
          <CheckboxComponent
            name="consentToRevealEmail"
            inputId="consentToRevealEmail"
            checked={consentToRevealEmail}
            onChange={event => showMyEmail(event.target.checked)}
          />
        </div>
      </div>
      {formState === CampaigningFormState.VIEW ? (
        <div className={styles.group}>
          <div className={styles.label}>
            {"€ "}
            {pledgedAmount}
          </div>
          <div className={styles.value}>
            <button onClick={changePledge} className={styles.changePledge}>
              <FormattedMessage id="shared-component.eto-overview.change" />
            </button>{" "}
            <FormattedMessage id="shared-component.eto-overview.or" />{" "}
            <button onClick={deletePledge} className={styles.deletePledge}>
              <FormattedMessage id="shared-component.eto-overview.delete" />
            </button>{" "}
            <FormattedMessage id="shared-component.eto-overview.your-pledge" />{" "}
          </div>
        </div>
      ) : (
        <Formik
          initialValues={{ amount: pledgedAmount }}
          onSubmit={({ amount }) => backNow(amount as number)}
          validationSchema={generateCampaigningValidation(minPledge, maxPledge)}
        >
          <Form className={styles.group}>
            <div className={cn(styles.label, styles.labelNoUppercase)}>
              <FormInput size={InputSize.SMALL} type="number" name="amount" prefix="€" />
            </div>
            <div className={styles.value}>
              <Button
                data-test-id="eto-bookbuilding-back-now"
                type="submit"
                size={ButtonSize.SMALL}
                width={ButtonWidth.BLOCK}
              >
                <FormattedMessage id="shared-component.eto-overview.back-now" />
              </Button>
            </div>
          </Form>
        </Formik>
      )}
    </>
  );
};

export { CampaigningActivatedInvestorApprovedWidgetLayout };
