import * as React from "react";
import { toast } from "react-toastify";

import { ButtonIcon } from "./buttons";

import * as clipboardIcon from "../../assets/img/inline_icons/icon-clipboard.svg";
import * as styles from "./CopyToClipboard.module.scss";

interface IProps {
  value: string | React.ReactNode;
  message?: string;
  "data-test-id"?: string;
}

class CopyToClipboard extends React.Component<IProps> {
  private inputNode: any = React.createRef();
  private inputRef = (element: any) => (this.inputNode = element);

  private copyToClipboard = (): void => {
    this.inputNode.select();
    document.execCommand("copy");

    toast.info(this.props.message || "Info has been copied");
  };

  render(): React.ReactNode {
    const { "data-test-id": dataTestId, value } = this.props;

    return (
      <>
        <input
          className={styles.hiddenInput}
          ref={this.inputRef}
          value={value as string}
          readOnly
          data-test-id={dataTestId}
        />
        <ButtonIcon svgIcon={clipboardIcon} onClick={this.copyToClipboard} />
      </>
    );
  }
}

export { CopyToClipboard };
