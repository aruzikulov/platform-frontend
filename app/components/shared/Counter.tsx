import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import * as styles from "./Counter.module.scss";

interface IProps {
  endDate: Date;
}

interface IPlateProps {
  value: number;
  label: React.ReactNode | string;
}

interface IState {
  date: number;
}

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const Plate: React.SFC<IPlateProps> = ({ value, label }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.plate}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};

export class Counter extends React.Component<IProps, IState> {
  state = {
    date: this.props.endDate.getTime() - Date.now(),
  };

  timer: any = null;

  componentDidMount(): void {
    const { date } = this.state;

    this.timer = setInterval(() => {
      if (date < 0) {
        clearInterval(this.timer);
      }

      this.setState(prevState => ({ date: prevState.date - 1000 }));
    }, 1000);
  }

  componentWillUnmount(): void {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
    }
  }

  render(): React.ReactNode {
    const { date } = this.state;

    const computedDays = Math.floor(date / day);
    const computedHours = Math.floor((date % day) / hour);
    const computedMinutes = Math.floor((date % hour) / minute);
    const computedSeconds = Math.floor((date % minute) / second);

    return (
      <div className={styles.counter}>
        <Plate
          value={computedDays < 0 ? 0 : computedDays}
          label={<FormattedMessage id="counter.label.days" />}
        />
        {":"}
        <Plate
          value={computedHours < 0 ? 0 : computedHours}
          label={<FormattedMessage id="counter.label.hours" />}
        />
        {":"}
        <Plate
          value={computedMinutes < 0 ? 0 : computedMinutes}
          label={<FormattedMessage id="counter.label.minutes" />}
        />
        {":"}
        <Plate
          value={computedSeconds < 0 ? 0 : computedSeconds}
          label={<FormattedMessage id="counter.label.seconds" />}
        />
      </div>
    );
  }
}
