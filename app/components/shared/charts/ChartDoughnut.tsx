import * as cn from "classnames";
import * as React from "react";
import { Doughnut } from "react-chartjs-2";
import { DEFAULT_CHART_COLOR } from "../../eto/shared/EtoPublicComponent";
import { ChartLegend } from "./ChartLegend";

import * as styles from "./ChartDoughnut.module.scss";

type TLayout = "vertical";

interface IProps {
  data: any;
  className?: string;
  layout?: TLayout;
  defaultLabel?: string;
}

const hasData = (data: any) => {
  return !(!data.length || (data.length && data.datasets[0].data.length === 0));
};

export const ChartDoughnut: React.SFC<IProps> = ({ data, layout, className, defaultLabel }) => {
  let chartData = hasData(data)
    ? data
    : {
        datasets: [
          {
            data: [1],
            backgroundColor: DEFAULT_CHART_COLOR,
            borderWidth: 0,
          },
        ],
        labels: [defaultLabel ? defaultLabel : "no data"],
      };

  return (
    <div className={cn(styles.chartDoughnut, className, layout || "")}>
      <div className={styles.chartWrapper}>
        <Doughnut
          data={chartData}
          legend={{ display: false }}
          height={100}
          width={100}
          options={{ tooltips: { enabled: false } }}
        />
      </div>
      <div className={styles.legendWrapper}>
        <ChartLegend data={data} />
      </div>
    </div>
  );
};
