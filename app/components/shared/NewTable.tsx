import * as cn from "classnames";
import { uniqueId } from "lodash";
import * as React from "react";

import { FormattedMessage } from "react-intl-phraseapp";
import { TTranslatedString } from "../../types";
import * as styles from "./NewTable.module.scss";
import { Panel } from "./Panel";

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

interface INewTable {
  children: React.ReactElement<INewTableRow> | React.ReactElement<INewTableRow>[];
  placeholder?: TTranslatedString;
  className?: string;
  keepRhythm?: boolean;
}

type TProps = INewTable & INewTableHeader;

class NewTableRow extends React.Component<INewTableRow> {
  render(): React.ReactNode {
    const { children } = this.props;

    return (
      <tr className={styles.row}>
        {React.Children.map(children, child => {
          return (
            <td className={styles.cell} key={uniqueId("table-row")}>
              {child}
            </td>
          );
        })}
      </tr>
    );
  }
}

class PlaceholderTableRow extends React.Component<IPlaceholderTableRow> {
  render(): React.ReactNode {
    const { children, numberOfCells } = this.props;

    return (
      <tr className={styles.row}>
        <td className={cn(styles.cell, styles.cellPlaceholder)} colSpan={numberOfCells}>
          {children || <FormattedMessage id="shared-components.table.default-placeholder" />}
        </td>
      </tr>
    );
  }
}

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
