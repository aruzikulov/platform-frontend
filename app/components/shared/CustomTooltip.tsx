import * as React from "react";
import { Tooltip, TooltipProps } from "reactstrap";

import * as styles from "./CustomTooltip.module.scss";

export class CustomTooltip extends React.Component<TooltipProps> {
  state = {
    tooltipOpen: false,
  };

  toggle = () => {
    if (!this.props.isOpen) {
      this.setState({
        tooltipOpen: !this.state.tooltipOpen,
      });
    }
  };

  componentDidMount(): void {
    if (this.props.isOpen) {
      this.setState({
        tooltipOpen: true,
      });
    }
  }

  render(): React.ReactChild {
    const { target, className, isOpen, toggle, children, ...props } = this.props;
    return (
      <>
        <Tooltip
          className={styles.tooltip}
          target={target}
          isOpen={this.state.tooltipOpen}
          toggle={toggle || this.toggle}
          {...props}
        >
          {children}
        </Tooltip>
      </>
    );
  }
}
