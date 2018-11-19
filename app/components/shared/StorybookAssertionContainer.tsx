/**
 * This is a concept test to add test assertions inside story book.
 * If after discussion this idea will not be used, please remove!
 */
import * as React from "react";

// make chai expectations possible in this component
// import * as chai from "chai";
// import * as chaiDom from "chai-dom";
// import "chai/register-expect";
// tslint:disable-next-line:no-commented-code
// chai.use(chaiDom);

interface IProps {
  assert: (domContainer: HTMLDivElement) => void;
}

export class StorybookAssertionContainer extends React.Component<IProps> {
  containerRef!: HTMLDivElement | null;
  componentDidMount(): void {
    if (this.containerRef) {
      this.props.assert(this.containerRef);
    } else {
      throw new Error("Could not render Component!");
    }
  }
  render(): React.ReactNode {
    return <div ref={ref => (this.containerRef = ref)}>{this.props.children}</div>;
  }
}
