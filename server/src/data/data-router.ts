import { Router } from "express";
import dataController from "./data-controller";

const DataRouter = Router();

DataRouter.post("/", dataController.createData);
DataRouter.delete("/:id", dataController.deleteDataById);

DataRouter.get("/materials", dataController.getMaterials);
DataRouter.get("/technologies", dataController.getTechnologies);
DataRouter.get("/processings", dataController.getProcessings);


export default DataRouter;