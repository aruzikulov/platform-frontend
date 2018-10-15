import { findLast, floor } from "lodash";
import * as React from "react";
import { FormattedPlural } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

type TExternalProps = {
  number: number;
  divider?: number;
  children?: (range: any) => React.ReactNode;
};

type TKeys = "thousand" | "million";

type TRangeDescriptor = {
  divider: number;
  key: TKeys;
};

const ranges: TRangeDescriptor[] = [
  { divider: 1e3, key: "thousand" },
  { divider: 1e6, key: "million" },
];

const translationKeys = {
  million: {
    one: <FormattedMessage id="shared-component.to-human-readable-form.million.one" />,
    other: <FormattedMessage id="shared-component.to-human-readable-form.million.other" />,
  },
  thousand: {
    one: <FormattedMessage id="shared-component.to-human-readable-form.thousand.one" />,
    other: <FormattedMessage id="shared-component.to-human-readable-form.thousand.other" />,
  },
};

function getRange(number: number, divider?: number): TRangeDescriptor | undefined {
  if (divider) {
    return ranges.find(range => range.divider === divider);
  }

  return findLast(ranges, range => number / range.divider >= 1);
}

const ToHumanReadableForm: React.SFC<TExternalProps> = ({ number, children, divider }) => {
  const range = getRange(number, divider);

  if (range) {
    const value = floor(number / range.divider, 1);
    const translation = translationKeys[range.key];

    return (
      <>
        {value}
        {!children && (
          <>
            {" "}
            <FormattedPlural value={value} one={translation.one} other={translation.other} />
          </>
        )}
        {children && (
          <>
            {" - "}
            {children(range.divider)}
          </>
        )}
      </>
    );
  }

  return (
    <>
      {number.toString()}
      {children && (
        <>
          {" - "}
          {children(1)}
        </>
      )}
    </>
  );
};

export { ToHumanReadableForm };
