import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { appRoutes } from "../../appRoutes";
import { DashboardLinkWidget } from "../../shared/dashboard-link-widget/DashboardLinkWidget";

export const UploadPamphletWidget = injectIntlHelpers(({ intl: { formatIntlMessage } }) => {
  return (
    <DashboardLinkWidget
      title={formatIntlMessage("settings.upload-pamphlet.title")}
      text={<FormattedMessage id="settings.upload-pamphlet-please-upload-pamphlet" />}
      to={appRoutes.documents}
      buttonText={<FormattedMessage id="settings.upload-pamphlet.title" />}
    />
  );
});
