import { storiesOf } from "@storybook/react";
import * as React from "react";

import { TagsEditorWidget } from "./TagsEditor";

storiesOf("TagsEditorWidget", module).add("default", () => (
  <TagsEditorWidget
    availableTags={["tag1", "tag2", "tag3", "tag with random text4", "tag5", "tag6"]}
    selectedTags={["tag1", "tag3"]}
    selectedTagsLimit={5}
  />
));
