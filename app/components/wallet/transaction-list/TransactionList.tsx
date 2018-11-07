import * as React from "react";
import { Col, Row } from "reactstrap";
import { Button, EButtonLayout } from "../../shared/buttons";
import { Date } from "../../shared/Date";
import { InlineIcon } from "../../shared/InlineIcon";
import { Money, TMoneyTransfer } from "../../shared/Money";
import { TableBody } from "../../shared/table/TableBody";
import { TableCell } from "../../shared/table/TableCell";
import { TableHeader } from "../../shared/table/TableHeader";
import { TableRow } from "../../shared/table/TableRow";
import * as styles from "./TransactionList.module.scss";

import * as LinkOutIcon from "../../../assets/img/inline_icons/link_out.svg";
import * as AddIcon from "../../../assets/img/inline_icons/plus.svg";

export enum TransactionType {
  Withdraw = "withdraw",
  Deposit = "deposit",
  Investment = "investment",
}

export interface ITransaction {
  timestamp: number;
  type: TransactionType;
  amount: string;
  fromTo: string;
  transfer: TMoneyTransfer;
  id: any;
}

interface IFilter {
  title: string;
  isSelected: boolean;
  onFilter: () => void;
}

interface ITransactionList {
  transactions: ITransaction[];
  categories: IFilter[];
  tabs: IFilter[];
}

const NoTransactionList = () => <div className="py-3">No transactions.</div>;

export const TransactionList: React.SFC<ITransactionList> = ({
  transactions,
  categories,
  tabs,
}) => (
  <Col className={styles.transactionList}>
    <Row>
      <Col>
        <div className={styles.tabs}>
          {tabs.map(({ title, onFilter, isSelected }) => (
            <div
              className={`${styles.tab} ${isSelected ? "is-selected" : ""}`}
              onClick={onFilter}
              key={title}
            >
              {title}
            </div>
          ))}
        </div>
      </Col>
    </Row>
    <Row>
      <Col>
        <div className={styles.categories}>
          {categories.map(({ title, onFilter, isSelected }) => (
            <div
              onClick={onFilter}
              className={`${styles.category} ${isSelected ? "is-selected" : ""}`}
              key={`category-${title}`}
            >
              {title}
            </div>
          ))}
        </div>
      </Col>
    </Row>
    <Row>
      <TableHeader mobileAction={() => {}} mobileActionName={"Sort"}>
        <TableCell>Date</TableCell>
        <TableCell>Transaction type</TableCell>
        <TableCell>Amount</TableCell>
        <TableCell>From/To</TableCell>
        <TableCell center>TXN</TableCell>
        <TableCell center>Details</TableCell>
      </TableHeader>
    </Row>
    <Row>
      <Col>
        <TableBody>
          {transactions.length === 0 ? (
            <NoTransactionList />
          ) : (
            transactions.map(({ id, timestamp, type, amount, fromTo, transfer }) => (
              <TableRow key={id}>
                <TableCell decorate mobileDescription="Date">
                  <Date timestamp={timestamp} />
                </TableCell>
                <TableCell decorate mobileDescription="Transaction type">
                  {type}
                </TableCell>
                <TableCell decorate mobileDescription="Amount">
                  <Money currency="eur_token" value={amount} transfer={transfer} />
                </TableCell>
                <TableCell decorate mobileDescription="From/To">
                  {fromTo}
                </TableCell>
                <TableCell decorate mobileDescription="TXN" center>
                  <Button layout={EButtonLayout.SECONDARY}>
                    <InlineIcon svgIcon={LinkOutIcon} />
                  </Button>
                </TableCell>
                <TableCell decorate mobileDescription="Details" center>
                  <Button layout={EButtonLayout.SECONDARY}>
                    <InlineIcon svgIcon={AddIcon} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Col>
    </Row>
  </Col>
);
