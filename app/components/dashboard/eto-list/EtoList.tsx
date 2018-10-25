import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { selectPublicEtos } from "../../../modules/public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../../modules/public-etos/types";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { EtoOverviewStatus } from "../../eto/overview/EtoOverviewStatus";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { SectionHeader } from "../../shared/SectionHeader";

interface IStateProps {
  etos: TEtoWithCompanyAndContract[] | undefined;
}

const EtoListComponent: React.SFC<IStateProps> = ({ etos }) => (
  <>
    <Col xs={12}>
      <SectionHeader>
        <FormattedMessage id="dashboard.eto-opportunities" />
      </SectionHeader>
    </Col>
    <Col xs={12}>
      {etos ? (
        etos.map(eto => (
          <div className="mb-3">
            <EtoOverviewStatus eto={eto} />
          </div>
        ))
      ) : (
        <LoadingIndicator type="hexagon" />
      )}
    </Col>
  </>
);

export const EtoList = compose<React.ComponentClass>(
  setDisplayName("EtoList"),
  onEnterAction({
    actionCreator: d => {
      d(actions.wallet.loadWalletData());
      d(actions.publicEtos.loadEtos());
    },
  }),
  appConnect<IStateProps>({
    stateToProps: state => ({
      etos: selectPublicEtos(state),
    }),
  }),
)(EtoListComponent);
