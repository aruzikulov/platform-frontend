import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EtoState } from "../../lib/api/eto/EtoApi.interfaces";
import { selectEtoWithCompanyAndContract } from "../../modules/public-etos/selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "../../modules/public-etos/types";
import { appConnect } from "../../store";

import * as styles from "./ETOState.module.scss";

export enum EProjectStatusSize {
  MEDIUM = "medium",
  LARGE = "large",
}

export enum EProjecStatusLayout {
  NORMAL = "normal",
  BLACK = "black",
}

interface IExternalProps {
  size?: EProjectStatusSize;
  layout?: EProjecStatusLayout;
  previewCode: string;
}

interface IStateProps {
  eto: TEtoWithCompanyAndContract;
}

export const statusToName: Record<
  EtoState | EETOStateOnChain,
  React.ReactElement<FormattedMessage>
> = {
  [EtoState.PREVIEW]: <FormattedMessage id="shared-component.eto-overview.status-in-preview" />,
  [EtoState.PENDING]: <FormattedMessage id="shared-component.eto-overview.status-in-review" />,
  [EtoState.LISTED]: <FormattedMessage id="shared-component.eto-overview.status-listed" />,
  [EtoState.PROSPECTUS_APPROVED]: (
    <FormattedMessage id="shared-component.eto-status.prospectus-approved" />
  ),
  [EtoState.ON_CHAIN]: <FormattedMessage id="shared-component.eto-overview.status-on-chain" />,
  // on chain state mappings
  [EETOStateOnChain.Setup]: <FormattedMessage id="eto.status.onchain.setup" />,
  [EETOStateOnChain.Whitelist]: <FormattedMessage id="eto.status.onchain.whitelist" />,
  [EETOStateOnChain.Public]: <FormattedMessage id="eto.status.onchain.public" />,
  [EETOStateOnChain.Signing]: <FormattedMessage id="eto.status.onchain.signing" />,
  [EETOStateOnChain.Claim]: <FormattedMessage id="eto.status.onchain.claim" />,
  [EETOStateOnChain.Payout]: <FormattedMessage id="eto.status.onchain.payout" />,
  [EETOStateOnChain.Refund]: <FormattedMessage id="eto.status.onchain.refund" />,
};

const stateToClassName: Partial<Record<EtoState | EETOStateOnChain, string>> = {
  [EtoState.PENDING]: styles.pending,
  [EtoState.LISTED]: styles.listed,
  [EETOStateOnChain.Refund]: styles.refund,
};

const ETOStateLayout: React.SFC<IStateProps & IExternalProps> = ({
  eto,
  size = EProjectStatusSize.MEDIUM,
  layout = EProjecStatusLayout.NORMAL,
}) => {
  const status = eto.contract ? eto.contract.timedState : eto.state;

  return (
    <div className={cn(styles.projectStatus, stateToClassName[status], size, layout)}>
      {statusToName[status]}
    </div>
  );
};

export const ETOState = appConnect<IStateProps, {}, IExternalProps>({
  stateToProps: (state, props) => ({
    eto: selectEtoWithCompanyAndContract(state, props.previewCode)!,
  }),
})(ETOStateLayout);
