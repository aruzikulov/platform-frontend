import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { IEtoDocument } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { EtherscanAddressLink } from "../../../shared/EtherscanLink";
import { Tag } from "../../../shared/Tag";

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
    <>
      {hasDocument(termSheet) ? (
        <Tag
          onClick={() => downloadDocument(termSheet)}
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
