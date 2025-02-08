// order-router.ts
import { Router } from "express";
import multer from "multer";
import orderController from "./order-controller";

const OrderRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create order endpoint
OrderRouter.post("/", upload.single("file"), orderController.createOrder);

// Get order details endpoint
OrderRouter.get("/:orderId", orderController.getOrder);

// Update order status endpoint
OrderRouter.patch("/:orderId/status", orderController.updateStatus);

export default OrderRouter;
