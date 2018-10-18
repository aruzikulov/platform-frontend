import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { externalRoutes } from "../../externalRoutes";
import { Button, EButtonLayout } from "../../shared/buttons";
import { Money } from "../../shared/Money";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as icon from "../../../assets/img/neu_icon.svg";
import * as styles from "./MyNeuWidget.module.scss";

interface IProps {
  balanceNeu: string;
  balanceEur?: string;
}

export const MyNeuWidget: React.SFC<IProps> = props => {
  return (
    <section className={cn(styles.background)}>
      <h5 className={cn(styles.title, "text-left pl-2 pl-md-3 pt-2")}>
        <FormattedMessage id="dashboard.my-neu-widget.my-neumark" />
      </h5>
      <Row noGutters>
        <Col xs={6} md={12} className="mb-2 mb-md-4 text-left ml-2 ml-md-0 text-md-center pt-1">
          <div className={cn(styles.neu)}>
            <img src={icon} className={cn(styles.icon, "mr-2 mb-1")} data-test-id="balance-neu" />
            <Money
              value={props.balanceNeu}
              currency="neu"
              doNotSeparateThousands
              data-test-id="my-neu-widget-neumark-balance"
            />
          </div>
        </Col>
        <Col md={12} className="text-right text-md-center" data-test-id="arrow-neu">
          <a href={externalRoutes.freshdesk}>
            <Button
              layout={EButtonLayout.SECONDARY}
              iconPosition="icon-after"
              theme="dark"
              svgIcon={arrowRight}
            >
              <FormattedMessage id="dashboard.my-neu-widget.about" />
            </Button>
          </a>
        </Col>
      </Row>
    </section>
  );
};
