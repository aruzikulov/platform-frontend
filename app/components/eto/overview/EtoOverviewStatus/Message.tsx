import * as React from "react";

import { TTranslatedString } from "../../../../types";
import { SuccessTick } from "../../../shared/SuccessTick";

import * as styles from "./Message.module.scss";

interface IExternalProps {
  showTick?: boolean;
  title?: TTranslatedString;
  summary?: TTranslatedString;
}

const Message: React.SFC<IExternalProps> = ({ showTick = true, title, summary }) => (
  <section className={styles.widget}>
    {showTick && <SuccessTick />}
    <header className={styles.message}>
      {title && <h5>{title}</h5>}
      {summary && <p>{summary}</p>}
    </header>
  </section>
);

export { Message };
