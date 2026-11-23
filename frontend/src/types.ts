export interface SeriesPoint {
  date: string;
  close: number;
  train_pred: number | null;
  test_pred: number | null;
}
export interface ForecastPoint {
  date: string;
  close: number;
}
export interface SweepRow {
  batch_size: number;
  epochs: number;
  val_RMSE: number;
  test_RMSE: number;
}
export interface ResultsData {
  ticker: string;
  split_index: number;
  time_step: number;
  series: SeriesPoint[];
  forecast: ForecastPoint[];
  metrics: Record<string, Record<string, number>>;
  sweep: SweepRow[];
}
