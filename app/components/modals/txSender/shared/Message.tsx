import * as React from "react";

import * as styles from "./Message.module.scss";

type TProps = {
  "data-test-id"?: string;
  title: string | React.ReactNode;
  hint: string | React.ReactNode;
  image?: React.ReactNode;
};

const Message: React.SFC<TProps> = ({ "data-test-id": dataTestId, image, title, hint }) => {
  return (
    <div data-test-id={dataTestId}>
      {image}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.hint}>{hint}</p>
    </div>
  );
};
export { Message };
