import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { appRoutes } from "../../appRoutes";
import { DashboardLinkWidget } from "../../shared/dashboard-link-widget/DashboardLinkWidget";

export const UploadProspectusWidget = injectIntlHelpers(({ intl: { formatIntlMessage } }) => {
  return (
    <DashboardLinkWidget
      title={formatIntlMessage("settings.upload-prospectus.title")}
      text={<FormattedMessage id="settings.upload-prospectus-please-upload-prospectus" />}
      to={appRoutes.documents}
      buttonText={<FormattedMessage id="settings.upload-prospectus.title" />}
    />
  );
});
