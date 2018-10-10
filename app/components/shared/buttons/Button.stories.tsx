import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Button, ButtonArrowRight, ButtonSize, ButtonWidth } from "./Button";

import * as icon from "../../../assets/img/inline_icons/icon_questionmark.svg";
import { EButtonLayout } from "./index";

storiesOf("buttons/default", module)
  .add("primary", () => (
    <>
      <Button>primary</Button>
      <br />
      <Button disabled>primary disabled</Button>
    </>
  ))
  .add("secondary", () => (
    <>
      <Button layout={EButtonLayout.SECONDARY}>secondary</Button>
      <br />
      <Button layout={EButtonLayout.SECONDARY} disabled>
        secondary disabled
      </Button>
    </>
  ))
  .add("inline", () => (
    <>
      <Button layout={EButtonLayout.INLINE}>Call to Action</Button>
    </>
  ))
  .add("simple", () => (
    <>
      <Button layout={EButtonLayout.SIMPLE}>Call to Action</Button>
    </>
  ))
  .add("with icons", () => (
    <>
      <Button layout={EButtonLayout.SECONDARY} svgIcon={icon} iconPosition="icon-before">
        icon before text
      </Button>
      <br />
      <Button layout={EButtonLayout.SECONDARY} svgIcon={icon} iconPosition="icon-after">
        icon after text
      </Button>
    </>
  ))
  .add("white theme", () => (
    <>
      <Button theme="white">primary</Button>
      <br />
      <Button theme="white" disabled>
        primary disabled
      </Button>
      <br />
      <Button svgIcon={icon} theme="white" iconPosition="icon-before">
        primary icon before text
      </Button>
      <br />
      <Button layout={EButtonLayout.SECONDARY} theme="white">
        secondary
      </Button>
      <br />
      <Button layout={EButtonLayout.SECONDARY} theme="white" disabled>
        secondary disabled
      </Button>
      <br />
      <Button
        layout={EButtonLayout.SECONDARY}
        svgIcon={icon}
        theme="white"
        iconPosition="icon-before"
      >
        secondary icon before text
      </Button>
      <br />
      <Button
        layout={EButtonLayout.SECONDARY}
        svgIcon={icon}
        theme="white"
        iconPosition="icon-before"
        disabled
      >
        secondary icon before text disabled
      </Button>
    </>
  ))
  .add("with size", () => (
    <>
      <Button size={ButtonSize.NORMAL}>normal button</Button>
      <br />
      <Button size={ButtonSize.SMALL}>small button</Button>
      <br />
    </>
  ))
  .add("with width", () => (
    <>
      <Button width={ButtonWidth.NORMAL}>normal button</Button>
      <br />
      <Button width={ButtonWidth.BLOCK}>wide button</Button>
      <br />
    </>
  ))
  .add("loading", () => <Button isLoading>Primary</Button>);

storiesOf("buttons/ArrowRight", module).add("primary", () => (
  <ButtonArrowRight>primary</ButtonArrowRight>
));
