import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";
import { compose } from "redux";

import { selectIsBookBuilding } from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { ButtonArrowRight } from "../../../shared/buttons";
import { Panel } from "../../../shared/Panel";

import { actions } from "../../../../modules/actions";
import * as styles from "../../etoContentWidget.module.scss";

interface IDispatchProps {
  startBookBuilding: () => void;
  stopBookBuilding: () => void;
}

interface IStateProps {
  bookBuildingState?: boolean;
}

type IProps = IDispatchProps & IStateProps & IIntlProps;

interface IStartBookBuilding {
  startBookBuilding: () => void;
}

const StartBookBuildingComponent: React.SFC<IStartBookBuilding & IIntlProps> = ({
  startBookBuilding,
  intl: { formatIntlMessage },
}) => (
  <Panel headerText={formatIntlMessage("settings.book-building-widget.start-book-building")}>
    <div className={styles.content}>
      <p className={cn(styles.text, "pt-2")}>
        <FormattedMessage id="settings.book-building-widget.proposal-accepted" />
      </p>
      <Col className="d-flex justify-content-center">
        <ButtonArrowRight onClick={startBookBuilding} data-test-id="eto-flow-start-bookbuilding">
          <FormattedMessage id="settings.book-building-widget.start-book-building" />
        </ButtonArrowRight>
      </Col>
    </div>
  </Panel>
);

interface IStopBookBuilding {
  stopBookBuilding: () => void;
}

const StopBookBuildingComponent: React.SFC<IStopBookBuilding & IIntlProps> = ({
  stopBookBuilding,
  intl: { formatIntlMessage },
}) => (
  <Panel headerText={formatIntlMessage("settings.book-building-widget.stop-book-building")}>
    <div className={styles.content}>
      <p className={cn(styles.text, "pt-2")}>
        <FormattedMessage id="settings.book-building-widget.manually-stop" />
      </p>
      <Col className="d-flex justify-content-center">
        <ButtonArrowRight onClick={stopBookBuilding}>
          <FormattedMessage id="settings.book-building-widget.stop-book-building" />
        </ButtonArrowRight>
      </Col>
    </div>
  </Panel>
);

export const BookBuildingWidgetComponent: React.SFC<IProps> = ({
  startBookBuilding,
  bookBuildingState,
  stopBookBuilding,
  intl,
}) => {
  return bookBuildingState ? (
    <StopBookBuildingComponent stopBookBuilding={stopBookBuilding} intl={intl} />
  ) : (
    <StartBookBuildingComponent startBookBuilding={startBookBuilding} intl={intl} />
  );
};

export const BookBuildingWidget = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      bookBuildingState: selectIsBookBuilding(state),
    }),
    dispatchToProps: dispatch => ({
      startBookBuilding: () => dispatch(actions.etoFlow.changeBookBuildingStatus(true)),
      stopBookBuilding: () => dispatch(actions.etoFlow.changeBookBuildingStatus(false)),
    }),
  }),
  injectIntlHelpers,
)(BookBuildingWidgetComponent);
