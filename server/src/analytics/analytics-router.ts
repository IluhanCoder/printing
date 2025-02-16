import { Router } from "express";
import analyticsController from "./analytics-controller";

const AnalyticsRouter = Router();

AnalyticsRouter.post("/", analyticsController.calculateStatistics);

export default AnalyticsRouter;