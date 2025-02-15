import { Router } from "express";
import serviceController from "./service-controller";
import multer from "multer";

const ServiceRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

ServiceRouter.post("/", upload.array("images"), serviceController.createService);
ServiceRouter.get("/:id", serviceController.getServiceDetails);
ServiceRouter.get("/", serviceController.fetchServices);
ServiceRouter.get("/:serviceId/feedback", serviceController.getServiceFeedback);

export default ServiceRouter;