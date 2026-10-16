// type
import { ChartDataset, ChartOptions, ChartType } from "chart.js";

export interface ChartjsOptions<TType extends ChartType = ChartType> {
    type: TType;
    chartOptions: ChartOptions<TType>;
    chartLabels?: string[];
    datasets?: ChartDataset<TType>[];
}