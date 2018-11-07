import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { appRoutes } from "../../../appRoutes";
import { ButtonLink } from "../../../shared/buttons";

import * as styles from "./RegisterNowWidget.module.scss";

const RegisterNowWidget: React.SFC = () => {
  return (
    <div className={styles.registerNow}>
      <div>
        <FormattedMessage id="shared-component.eto-overview.register-cta" />
      </div>
      <ButtonLink
        className="mt-3"
        to={appRoutes.register}
        data-test-id="logged-out-campaigning-register"
      >
        <FormattedMessage id="shared-component.eto-overview.register" />
      </ButtonLink>
    </div>
  );
};

export { RegisterNowWidget };
