import api from "../api";
import { StatisticItem } from "./analytics-types";

export default new class AnalyticsService {
    async calculateAmount(startDate: Date, endDate: Date): Promise<{result: {amount: StatisticItem[], doneAmount: StatisticItem[]}}> {
        return (await api.post("/statistics", {startDate, endDate})).data;
    }
}