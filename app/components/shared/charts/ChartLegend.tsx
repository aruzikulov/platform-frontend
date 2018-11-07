import * as React from "react";
import * as styles from "./ChartLegend.module.scss";

interface IDataset {
  data: number[];
  backgroundColor: string[];
}

interface IData {
  datasets: IDataset[];
  labels: string[];
}

interface IProps {
  data: IData;
}

function formatPercent(value: number, numbers: number[]): string {
  return `${Math.round((value / numbers.reduce((a, b) => a + b)) * 100)}%`;
}

export const ChartLegend: React.SFC<IProps> = ({ data }) => {
  return (
    <div>
      {data.datasets.map(dataset => {
        return dataset.data.map((value, index) => {
          return (
            <div className={styles.chartLegend} key={data.labels[index]}>
              <div
                className={styles.indicator}
                style={{ backgroundColor: dataset.backgroundColor[index] }}
              />
              <div>{`${data.labels[index]} ${formatPercent(value, dataset.data)}`}</div>
            </div>
          );
        });
      })}
    </div>
  );
};
