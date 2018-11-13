import * as cn from "classnames";
import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import { TTranslatedString } from "../../types";
import { CopyToClipboard } from "./CopyToClipboard";
import { InlineIcon } from "./InlineIcon";

import * as iconDownload from "../../assets/img/inline_icons/download.svg";
import * as styles from "./HighlightedStripField.module.scss";

interface IProps {
  label?: TTranslatedString;
  value?: string | React.ReactNode;
  icon?: string;
  link?: {
    title: TTranslatedString;
    url: string;
  };
  withCopy?: boolean;
  dataTestId?: string;
  whiteBackground?: boolean;
}

export const HighlightedStripField: React.SFC<IProps> = ({
  label,
  value,
  icon,
  link,
  withCopy,
  whiteBackground,
  dataTestId,
}) => {
  return (
    <Container>
      <Row
        className={cn(
          styles.highlightedField,
          withCopy && "d-flex justify-content-between",
          whiteBackground && styles.whiteBackground,
        )}
        data-test-id={dataTestId}
      >
        <Col>
          {icon && <img className={styles.icon} src={icon} alt="icon" />}
          {label && <span className={styles.label}>{label}</span>}
          {link && (
            <div>
              <InlineIcon className={styles.downloadIcon} svgIcon={iconDownload} />
              <a href={link.url} download>
                {link.title}
              </a>
            </div>
          )}
        </Col>
        {value && (
          <Col className="d-flex justify-content-end" xs={7}>
            <span>
              {withCopy && <CopyToClipboard value={value} className={styles.icon} />}
              <span className={styles.value}>{value}</span>
            </span>
          </Col>
        )}
      </Row>
    </Container>
  );
};
