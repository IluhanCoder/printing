// order-controller.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import orderService from "./order-service";
import { OrderCredentials } from "./order-model";
import { IUser } from "../user/user-model";

export interface ExtendedRequest extends Request {
  user?: IUser;
  file?: Express.Multer.File;
}

export default new class OrderController {
  async createOrder(req: ExtendedRequest, res: Response): Promise<void> {
    try {
      const { desc, processing, adress, service } = req.body;
      const file = req.file;
      if (!file) {
        throw new Error("File is required");
      }
      const fileObj = {
        data: file.buffer,
        contentType: file.mimetype,
      };
      const credentials: OrderCredentials = {
        desc,
        processing,
        adress,
        file: fileObj,
        service,
        from: req.user ? req.user._id as mongoose.Types.ObjectId : undefined,
      };
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized: User not logged in." });
        return;
      }
      const from: mongoose.Types.ObjectId = req.user._id as mongoose.Types.ObjectId;
      const order = await orderService.createOrder({ ...credentials, from });
      res.status(200).json({ order });
    } catch (error: any) {
      console.error("Error creating order:", error);
      res.status(400).json({ message: error.message });
    }
  }

  async getOrder(req: ExtendedRequest, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const order = await orderService.fetchOrder(orderId);
      res.status(200).json(order);
    } catch (error: any) {
      console.error("Error fetching order:", error);
      res.status(400).json({ message: error.message });
    }
  }

  async updateStatus(req: ExtendedRequest, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      res.status(200).json({ order: updatedOrder });
    } catch (error: any) {
      console.error("Error updating order status:", error);
      res.status(400).json({ message: error.message });
    }
  }

  async fetchOrdersForUser(req: Request, res: Response) {
    try {
      const userId = req.params.userId; // Get userId from request params
      const orders = await orderService.fetchOrdersForUser(userId);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}();
