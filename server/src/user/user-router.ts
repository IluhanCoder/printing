import { Router } from "express";
import userController from "./user-controller";

const userRouter = Router();

userRouter.post("/specialist", userController.createSpecialist);
userRouter.get("/id", userController.getUserId);
userRouter.put("/profile", userController.updateProfile);
userRouter.get("/:userId/card", userController.getUserCard);
userRouter.get("/profile", userController.getProfile);

export default userRouter;