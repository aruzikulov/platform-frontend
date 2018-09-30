import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { IEtoDocument } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { TTranslatedString } from "../../../../types";
import { Tag } from "../../../shared/Tag";

export interface ITagsWidget {
  termSheet: IEtoDocument;
  prospectusApproved: IEtoDocument;
  smartContractOnchain: boolean;
  etoId: string;
}

const LinkedTag: React.SFC<{ href: string; text: TTranslatedString; download?: boolean }> = ({
  href,
  text,
  download,
}) => {
  return (
    <a href={href} download={download} target="_blank">
      <Tag size="small" theme="green" layout="ghost" text={text} />
    </a>
  );
};

const TagsWidget: React.SFC<ITagsWidget> = ({
  termSheet,
  prospectusApproved,
  smartContractOnchain,
  etoId,
}) => {
  const hasTermSheet = termSheet && termSheet.name && termSheet.name.length;
  const hasProspectusApproved =
    prospectusApproved && prospectusApproved.name && prospectusApproved.name.length;

  return (
    <>
      {hasTermSheet ? (
        <LinkedTag
          href={termSheet.name}
          download
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
      {hasProspectusApproved ? (
        <LinkedTag
          href={prospectusApproved.name}
          download
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
        <LinkedTag
          href={`https://etherscan.io/address/${etoId}`}
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

export { TagsWidget };
