import { Request, Response } from "express";
import { ExtendedRequest } from "../auth/auth-middleware";
import analyticsService from "./analytics-service";
import mongoose from "mongoose";

export default new class AnalyticsController {
    async calculateStatistics(req: ExtendedRequest, res: Response) {
        try {
            const {startDate, endDate} = req.body;
            const id: mongoose.Types.ObjectId = req.user._id as mongoose.Types.ObjectId;
            const result = await analyticsService.calculateStatistics(id, startDate, endDate);
            res.status(200).json({result});
        } catch (error) {
            console.error("Error creating order:", error);
            res.status(400).json({ message: error.message });
        }
    }
}