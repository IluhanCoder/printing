import { StatisticItem, AnalyticsResponse } from "./analytics-types";

export function convertArray(inputArray: StatisticItem[]) {
    return inputArray.map((value: StatisticItem) => ({
      name: `${value.day ? `${value.day}/`:""}${value.month}${value.year ? `/${value.year}`:""}`,
      uv: value.amount
    }));
}