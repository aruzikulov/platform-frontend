import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { EEtoDocumentType, IEtoDocument } from "../../../../lib/api/eto/EtoFileApi.interfaces";
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
  downloadDocumentByType: (type: EEtoDocumentType) => void;
};

type TLayoutProps = ITagsWidget & TDispatchProps;

const hasDocument = (document: IEtoDocument): boolean =>
  !!document && !!document.name && !!document.name.length;

const TagsWidgetLayout: React.SFC<TLayoutProps> = ({
  termSheet,
  prospectusApproved,
  smartContractOnchain,
  etoId,
  downloadDocumentByType,
}) => {
  return (
    <>
      {hasDocument(termSheet) ? (
        <Tag
          onClick={() => downloadDocumentByType(termSheet.documentType)}
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
          onClick={() => downloadDocumentByType(prospectusApproved.documentType)}
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
      downloadDocumentByType: documentType =>
        dispatch(actions.etoDocuments.downloadDocumentByType(documentType)),
    }),
  }),
)(TagsWidgetLayout);

export { TagsWidget };
