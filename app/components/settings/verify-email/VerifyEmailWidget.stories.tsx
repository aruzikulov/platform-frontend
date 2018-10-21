import { storiesOf } from "@storybook/react";
import * as React from "react";

import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import { VerifyEmailWidgetComponent } from "./VerifyEmailWidget";

storiesOf("VerifyEmailWidgetComponent", module)
  .add("verified email", () => (
    <VerifyEmailWidgetComponent
      intl={dummyIntl}
      isUserEmailVerified={true}
      isThereUnverifiedEmail={false}
      isEmailTemporaryCancelled={false}
      resendEmail={() => {}}
      revertCancelEmail={() => {}}
      cancelEmail={() => {}}
      addNewEmail={() => {}}
      step={1}
      verifiedEmail="email@test.com"
    />
  ))
  .add("unverified and verified emails", () => (
    <VerifyEmailWidgetComponent
      intl={dummyIntl}
      isUserEmailVerified={true}
      isEmailTemporaryCancelled={false}
      isThereUnverifiedEmail={true}
      revertCancelEmail={() => {}}
      resendEmail={() => {}}
      cancelEmail={() => {}}
      addNewEmail={() => {}}
      step={1}
      unverifiedEmail="email@test.com"
      verifiedEmail="verified_email@test.com"
    />
  ))
  .add("unverified email", () => (
    <VerifyEmailWidgetComponent
      intl={dummyIntl}
      isUserEmailVerified={false}
      isEmailTemporaryCancelled={false}
      revertCancelEmail={() => {}}
      cancelEmail={() => {}}
      isThereUnverifiedEmail={true}
      resendEmail={() => {}}
      addNewEmail={() => {}}
      step={1}
      unverifiedEmail="email@test.com"
    />
  ))
  .add("no email", () => (
    <VerifyEmailWidgetComponent
      intl={dummyIntl}
      cancelEmail={() => {}}
      isUserEmailVerified={false}
      revertCancelEmail={() => {}}
      isThereUnverifiedEmail={false}
      isEmailTemporaryCancelled={false}
      resendEmail={() => {}}
      addNewEmail={() => {}}
      step={1}
    />
  ))
  .add("Cancellation in process", () => (
    <VerifyEmailWidgetComponent
      intl={dummyIntl}
      isUserEmailVerified={false}
      revertCancelEmail={() => {}}
      cancelEmail={() => {}}
      isThereUnverifiedEmail={true}
      isEmailTemporaryCancelled={true}
      resendEmail={() => {}}
      addNewEmail={() => {}}
      step={1}
    />
  ));
