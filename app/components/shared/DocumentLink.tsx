import * as React from "react";

import { TTranslatedString } from "../../types";
import { Button, ButtonTextPosition, EButtonLayout } from "./buttons";
import { Document } from "./Document";

import * as styles from "./DocumentLink.module.scss";

export interface IDocumentLinkProps {
  url: string;
  name: TTranslatedString;
  altIcon?: React.ReactNode;
}

const DocumentLink: React.SFC<IDocumentLinkProps> = ({ url, name, altIcon }) => {
  const contents = (
    <>
      {altIcon || <Document extension={url} />}
      {name}
    </>
  );

  if (url === "") {
    return <span className={styles.documentLink}>{contents}</span>;
  } else {
    return (
      <a href={url} className={styles.documentLink} target="_blank">
        {contents}
      </a>
    );
  }
};

export interface IDocumentTemplateButtonProps {
  title: string | React.ReactNode;
  altIcon?: React.ReactNode;
  onClick: () => void;
}

const DocumentTemplateButton: React.SFC<IDocumentTemplateButtonProps> = ({
  onClick,
  title,
  altIcon,
}) => {
  return (
    <Button
      layout={EButtonLayout.INLINE}
      onClick={onClick}
      className={styles.documentButton}
      textPosition={ButtonTextPosition.LEFT}
    >
      {altIcon || <Document extension="pdf" />}
      {title}
    </Button>
  );
};

export { DocumentLink, DocumentTemplateButton };
