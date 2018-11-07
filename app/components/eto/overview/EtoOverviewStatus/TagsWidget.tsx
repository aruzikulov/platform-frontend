import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { IEtoDocument } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { withParams } from "../../../../utils/withParams";
import { appRoutes } from "../../../appRoutes";
import { EtherscanAddressLink } from "../../../shared/EtherscanLink";
import { Tag } from "../../../shared/Tag";
import { EtoWidgetContext } from "../../EtoWidgetView";

export interface ITagsWidget {
  termSheet: IEtoDocument;
  prospectusApproved: IEtoDocument;
  smartContractOnchain: boolean;
  etoId: string;
}

type TDispatchProps = {
  downloadDocument: (document: IEtoDocument) => void;
};

type TLayoutProps = ITagsWidget & TDispatchProps;

const hasDocument = (document: IEtoDocument): boolean =>
  !!document && !!document.name && !!document.name.length;

const TagsWidgetLayout: React.SFC<TLayoutProps> = ({
  termSheet,
  prospectusApproved,
  smartContractOnchain,
  etoId,
  downloadDocument,
}) => {
  return (
    <EtoWidgetContext.Consumer>
      {previewCode => (
        <>
          {hasDocument(termSheet) ? (
            <Tag
              onClick={() => downloadDocument(termSheet)}
              to={previewCode ? withParams(appRoutes.etoPublicView, { previewCode }) : undefined}
              target={previewCode ? "_blank" : undefined}
              size="small"
              theme="green"
              layout="ghost"
              text={<FormattedMessage id="shared-component.eto-overview.term-sheet" />}
            />
          ) : (
            <Tag
              size="small"
              theme="silver"
              layout="ghost"
              text={<FormattedMessage id="shared-component.eto-overview.term-sheet" />}
            />
          )}
          {hasDocument(prospectusApproved) ? (
            <Tag
              onClick={() => downloadDocument(prospectusApproved)}
              to={previewCode ? withParams(appRoutes.etoPublicView, { previewCode }) : undefined}
              target={previewCode ? "_blank" : undefined}
              size="small"
              theme="green"
              layout="ghost"
              text={<FormattedMessage id="shared-component.eto-overview.prospectus-approved" />}
            />
          ) : (
            <Tag
              size="small"
              theme="silver"
              layout="ghost"
              text={<FormattedMessage id="shared-component.eto-overview.prospectus-approved" />}
            />
          )}
          {smartContractOnchain ? (
            <Tag
              component={EtherscanAddressLink}
              componentProps={{ address: etoId }}
              to={previewCode ? withParams(appRoutes.etoPublicView, { previewCode }) : undefined}
              target={previewCode ? "_blank" : undefined}
              size="small"
              theme="green"
              layout="ghost"
              text={<FormattedMessage id="shared-component.eto-overview.smart-contract-on-chain" />}
            />
          ) : (
            <Tag
              size="small"
              theme="silver"
              layout="ghost"
              text={<FormattedMessage id="shared-component.eto-overview.smart-contract-on-chain" />}
            />
          )}
        </>
      )}
    </EtoWidgetContext.Consumer>
  );
};

const TagsWidget = compose<TLayoutProps, ITagsWidget>(
  appConnect<{}, TDispatchProps>({
    dispatchToProps: dispatch => ({
      downloadDocument: (document: IEtoDocument) =>
        dispatch(actions.publicEtos.downloadPublicEtoDocument(document)),
    }),
  }),
)(TagsWidgetLayout);

export { TagsWidget };
