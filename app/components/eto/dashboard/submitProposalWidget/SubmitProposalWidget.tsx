import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { ButtonArrowRight } from "../../../shared/buttons";
import { Panel } from "../../../shared/Panel";

import * as styles from "../../etoContentWidget.module.scss";

interface IDispatchProps {
  submitProposal: () => void;
}

export const SubmitProposalWidgetComponent: React.SFC<IDispatchProps> = ({ submitProposal }) => {
  return (
    <Panel headerText={<FormattedMessage id="settings.submit-your-proposal.header" />}>
      <div className={styles.content}>
        <p className={cn(styles.text, "pt-2")}>
          <FormattedMessage id="settings.submit-proposal-widget.completed-fields" />
        </p>
        <Col className="d-flex justify-content-center">
          <ButtonArrowRight data-test-id="eto-dashboard-submit-proposal" onClick={submitProposal}>
            Submit
          </ButtonArrowRight>
        </Col>
      </div>
    </Panel>
  );
};

export const SubmitProposalWidget = compose<React.SFC>(
  appConnect<IDispatchProps>({
    dispatchToProps: dispatch => ({
      submitProposal: () => dispatch(actions.etoFlow.submitDataStart()),
    }),
  }),
)(SubmitProposalWidgetComponent);
