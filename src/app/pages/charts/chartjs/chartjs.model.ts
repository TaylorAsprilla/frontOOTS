// type
import { ChartDataset, ChartOptions, ChartType } from "chart.js";

export interface ChartjsOptions<TType extends ChartType = ChartType> {
    type: ChartType;
    chartOptions: ChartOptions<TType>;
    chartLabels?: string[];
    datasets?: ChartDataset<TType>[];
}