import { Router } from "express";
import userController from "./user-controller";

const userRouter = Router();

userRouter.post("/specialist", userController.createSpecialist);
userRouter.get("/id", userController.getUserId);

export default userRouter;