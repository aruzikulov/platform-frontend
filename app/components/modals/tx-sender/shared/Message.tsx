import * as React from "react";

import { TTranslatedString } from "../../../../types";

import * as styles from "./Message.module.scss";

type TProps = {
  "data-test-id"?: string;
  title: TTranslatedString;
  hint?: TTranslatedString;
  text?: TTranslatedString;
  image?: React.ReactNode;
};

const Message: React.SFC<TProps> = ({
  "data-test-id": dataTestId,
  image,
  title,
  text,
  hint,
  children,
}) => {
  return (
    <section className="text-center" data-test-id={dataTestId}>
      {image}
      <h3 className={styles.title}>{title}</h3>
      {hint && <p className={styles.hint}>{hint}</p>}
      {text && <p className={styles.text}>{text}</p>}
      {children}
    </section>
  );
};
export { Message };
