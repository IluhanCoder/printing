export interface StatisticItem {
    year: number, month: number, day: number, amount: number
}

export interface AnalyticsResponse {
    amount: StatisticItem[],
    doneAmount: StatisticItem[]
}