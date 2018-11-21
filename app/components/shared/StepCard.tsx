import * as React from "react";

import * as styles from "./StepCard.module.scss";

interface IStepCardProps {
  img: string;
  text: string | React.ReactNode;
}
export const StepCard: React.SFC<IStepCardProps> = ({ img, text }) => (
  <div className={styles.stepCard}>
    <img src={img} className="mb-3" />
    <span>{text}</span>
  </div>
);
