import * as React from "react";
import { Col } from "reactstrap";

import { HorizontalLine } from "./HorizontalLine";

import * as styles from "./CenteredListWithTitle.module.scss";

interface IProps {
  title: string;
  list: string[];
}

export const CenteredListWithTitle: React.SFC<IProps> = ({ title, list }) => {
  return (
    <Col xs={12} md={6} className="py-4">
      <h3 className={styles.title}>{title}</h3>
      <HorizontalLine theme="yellow" size="narrow" className="my-3" />
      <div>
        {list.map((listElement, index) => (
          <div key={index}>{listElement}</div>
        ))}
      </div>
    </Col>
  );
};
