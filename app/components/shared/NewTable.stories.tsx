import { storiesOf } from "@storybook/react";
import * as React from "react";

import { NewTable, NewTableRow } from "./NewTable";

storiesOf("NewTable", module)
  .add("default", () => (
    <NewTable titles={["Name", "Surname", "Role"]}>
      <NewTableRow>
        <>Pawel</>
        <>Lula</>
        <>Developer</>
      </NewTableRow>
      <NewTableRow>
        <>Wiktor</>
        <>Furman</>
        <>Developer</>
      </NewTableRow>
      <NewTableRow>
        <>Thomas</>
        <>Gorny</>
        <>Developer</>
      </NewTableRow>
    </NewTable>
  ))
  .add("keeps rhytm", () => (
    <NewTable titles={["Name", "Surname", "Role"]} keepRhythm>
      <NewTableRow>
        <>Pawel</>
        <>Lula</>
        <>Developer</>
      </NewTableRow>
      <NewTableRow>
        <>Wiktor</>
        <>Furman</>
        <>Developer</>
      </NewTableRow>
      <NewTableRow>
        <>Thomas</>
        <>Gorny</>
        <>Developer</>
      </NewTableRow>
    </NewTable>
  ));
