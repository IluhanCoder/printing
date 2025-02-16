import { StatisticItem } from './../../../client/src/analytics/analytics-types';
import OrderModel from "../order/order-model"; // Import your order model
import { eachDayOfInterval, format } from "date-fns"; // Using date-fns to generate date ranges
import mongoose from 'mongoose';
import analyticsController from './analytics-controller';

export default new class AnalyticsController {
async calculateStatistics(id: mongoose.Types.ObjectId, startDate: Date, endDate: Date): Promise<{amount: StatisticItem[], doneAmount: StatisticItem[]}> {
  try {
    // Generate all days between startDate and endDate
    const allDays = eachDayOfInterval({ start: startDate, end: endDate }).map((day) => ({
      year: day.getFullYear(),
      month: day.getMonth() + 1, // JS months are 0-indexed, so add 1
      day: day.getDate(),
      amount: 0, // Default amount is 0
    }));

    // Aggregate for created orders (amount)
    const createdOrders = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          amount: { $sum: 1 }, // Count orders per day
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          day: "$_id.day",
          amount: 1,
        },
      },
    ]);

    // Merge created orders into the allDays array
    allDays.forEach((day) => {
      const match = createdOrders.find(
        (order) => order.year === day.year && order.month === day.month && order.day === day.day
      );
      if (match) {
        day.amount = match.amount;
      }
    });

    // Aggregate for received orders (doneAmount)
    const receivedOrders = await OrderModel.aggregate([
      {
        $match: {
          status: "received",
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          amount: { $sum: 1 }, // Count received orders per day
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          day: "$_id.day",
          amount: 1,
        },
      },
    ]);

    // Initialize cumulative doneAmount with 0 and calculate it over all days
    let cumulativeReceived = 0;
    const doneAmount = allDays.map((day) => {
      const match = receivedOrders.find(
        (order) => order.year === day.year && order.month === day.month && order.day === day.day
      );
      if (match) {
        cumulativeReceived += match.amount;
      }
      return {
        year: day.year,
        month: day.month,
        day: day.day,
        amount: cumulativeReceived, // Carry over cumulative received orders
      };
    });

    // Return the result with both amounts and doneAmount
    return { amount: allDays, doneAmount };
  } catch (error) {
    console.error("Error calculating statistics", error);
    throw new Error("Error calculating statistics");
  }
}
}
