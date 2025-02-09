import { Router } from "express";
import authRouter from "./auth/auth-router";
import userRouter from "./user/user-router";
import DataRouter from "./data/data-router";
import ServiceRouter from "./service/service-router";
import authMiddleware from "./auth/auth-middleware";
import OrderRouter from "./order/order-router";
import blogRouter from "./blog/blog-router";

const router = Router();

router.use('/auth', authRouter);
router.use(authMiddleware);
router.use('/user', userRouter);
router.use('/data', DataRouter);
router.use('/service', ServiceRouter);
router.use('/order', OrderRouter);
router.use('/blog', blogRouter);

export default router;