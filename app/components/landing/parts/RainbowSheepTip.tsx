import * as cn from "classnames";
import * as React from "react";

import { ScrollSpy } from "./ScrollSpy";

import * as sheep from "../../../assets/img/landing/rainbowsheep.gif";
import * as thoughts from "../../../assets/img/landing/thoughts.svg";
import { Dictionary } from "../../../types";
import * as styles from "./RainbowSheepTip.module.scss";

interface IProps {
  side: "left" | "right";
  triggerId: string;
  tip: string[];
}

interface IState {
  open: boolean;
  tipIndex: number;
}

const TRIGGER_DELTA = 100;
const TIP_TIMEOUT = 5000;
const DEFAULT_MESSAGE = "Never stop bouncing :)";

export class RainbowSheepTip extends React.Component<IProps> {
  state: IState = {
    open: false,
    tipIndex: -1,
  };

  timerTask: any;

  onClick = () => {
    this.setState((s: IState) => ({
      open: true,
      tipIndex: s.tipIndex + 1,
    }));

    if (this.timerTask) {
      clearTimeout(this.timerTask);
    }
    this.timerTask = setTimeout(() => this.setState({ open: false }), TIP_TIMEOUT);
  };

  private reset = () => {
    this.setState({
      open: false,
      tipIndex: -1,
    });
  };

  render(): React.ReactNode {
    const { side, tip, triggerId } = this.props;
    const { open, tipIndex } = this.state;

    return (
      <ScrollSpy
        condition={() => {
          const triggerPoint: number = (document
            .getElementById(triggerId)!
            .getBoundingClientRect() as any).y;

          const middleOfTheScreen = window.innerHeight / 2;

          return (
            middleOfTheScreen > triggerPoint - TRIGGER_DELTA &&
            middleOfTheScreen < triggerPoint + TRIGGER_DELTA
          );
        }}
        onHide={this.reset}
      >
        {visible => (
          <div
            className={cn(styles.sheepWrapper, !visible && styles.hidden, styles[side])}
            onClick={this.onClick}
          >
            {open && (
              <div className={styles.thoughts}>
                <img src={thoughts} />
                <span className={styles.thoughtsText}>{tip[tipIndex] || DEFAULT_MESSAGE}</span>
              </div>
            )}
            <img src={sheep} />
          </div>
        )}
      </ScrollSpy>
    );
  }
}

export function getTriggerPoint(
  windowWidth: number,
  responsivePoints: Dictionary<number> | undefined,
  defaultPoint: number,
): number {
  if (!responsivePoints) {
    return defaultPoint;
  }

  const sortedResponsivePoints = Object.keys(responsivePoints)
    .map(v => parseFloat(v))
    .sort((a, b) => a - b);

  const breakpoint = sortedResponsivePoints.filter(b => windowWidth <= b)[0];

  return (breakpoint && responsivePoints[breakpoint]) || defaultPoint;
}
