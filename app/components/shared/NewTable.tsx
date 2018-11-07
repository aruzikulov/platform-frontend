import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../types";
import { Panel } from "./Panel";

import * as styles from "./NewTable.module.scss";

interface INewTableHeader {
  titles: (TTranslatedString | React.ReactNode)[];
}

interface INewTableRow {
  children: React.ReactNode[];
}

interface IPlaceholderTableRow {
  children?: TTranslatedString;
  numberOfCells: number;
}

type INewTableChildren =
  | React.ReactElement<INewTableRow>
  | React.ReactElement<INewTableRow>[]
  | null;

interface INewTable {
  children: INewTableChildren | INewTableChildren[];
  placeholder?: TTranslatedString;
  className?: string;
  keepRhythm?: boolean;
}

type TProps = INewTable & INewTableHeader;

const NewTableRow: React.SFC<INewTableRow> = ({ children }) => (
  <tr className={styles.row}>
    {React.Children.toArray(children).map((child, index) => {
      return (
        <td className={styles.cell} key={index}>
          {child}
        </td>
      );
    })}
  </tr>
);

const PlaceholderTableRow: React.SFC<IPlaceholderTableRow> = ({ children, numberOfCells }) => (
  <tr className={styles.row}>
    <td className={cn(styles.cell, styles.cellPlaceholder)} colSpan={numberOfCells}>
      {children || <FormattedMessage id="shared-components.table.default-placeholder" />}
    </td>
  </tr>
);

const NewTable: React.SFC<TProps> = ({ titles, children, className, placeholder, keepRhythm }) => {
  const isEmpty = React.Children.count(children) === 0;

  return (
    <Panel>
      <div className={cn(styles.tableWrapper, className, keepRhythm && "keep-rhythm")}>
        <table className={styles.table}>
          <thead className={styles.header}>
            <tr>
              {titles.map((title, index) => (
                <th className={styles.cell} key={index}>
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <PlaceholderTableRow numberOfCells={titles.length}>{placeholder}</PlaceholderTableRow>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
};

export { NewTable, NewTableRow };
