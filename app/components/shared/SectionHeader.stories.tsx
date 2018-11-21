import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ESectionHeaderSize, SectionHeader } from "./SectionHeader";

storiesOf("Basic UI/SectionHeader", module)
  .add("layout: has decorator", () => <SectionHeader>Lorem Ipsum</SectionHeader>)
  .add("layout: has decorator and description", () => (
    <SectionHeader description={"No causae vocibus dissentiet pro, id sed diceret blandit."}>
      Lorem Ipsum
    </SectionHeader>
  ))
  .add("layout: without decorator", () => (
    <SectionHeader layoutHasDecorator={false}>Lorem Ipsum</SectionHeader>
  ))
  .add("layout: without decorator and with description", () => (
    <SectionHeader
      layoutHasDecorator={false}
      description={"No causae vocibus dissentiet pro, id sed diceret blandit."}
    >
      Lorem Ipsum
    </SectionHeader>
  ))
  .add("size small, without decorator and with description", () => (
    <SectionHeader
      size={ESectionHeaderSize.SMALL}
      layoutHasDecorator={false}
      description={"No causae vocibus dissentiet pro, id sed diceret blandit."}
    >
      Lorem Ipsum
    </SectionHeader>
  ))
  .add("size small, with decorator and description", () => (
    <SectionHeader
      size={ESectionHeaderSize.SMALL}
      description={"No causae vocibus dissentiet pro, id sed diceret blandit."}
    >
      Lorem Ipsum
    </SectionHeader>
  ));
