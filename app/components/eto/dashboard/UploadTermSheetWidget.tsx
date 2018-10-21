import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { appRoutes } from "../../appRoutes";
import { DashboardLinkWidget } from "../../shared/dashboard-link-widget/DashboardLinkWidget";

export const UploadTermSheetWidget = injectIntlHelpers(({ intl: { formatIntlMessage } }) => {
  return (
    <DashboardLinkWidget
      title={formatIntlMessage("settings.upload-term-sheet.title")}
      text={<FormattedMessage id="settings.upload-term-sheet-please-upload-term-sheet" />}
      to={appRoutes.documents}
      buttonText={<FormattedMessage id="settings.upload-term-sheet.title" />}
    />
  );
});
