// order-controller.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import orderService from "./order-service";
import OrderModel, { OrderCredentials } from "./order-model";
import { IUser } from "../user/user-model";

export interface ExtendedRequest extends Request {
  user?: IUser;
  file?: Express.Multer.File;
}

export default new class OrderController {
  async createOrder(req: ExtendedRequest, res: Response): Promise<void> {
    try {
      const { desc, processing, adress, service, budget } = req.body;
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
        budget,
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
      console.log(status)
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

  async submitFeedback(req: ExtendedRequest, res: Response): Promise<void> {
    const { orderId, feedbackText, feedbackPoints } = req.body;
  
    try {
      // Find the order by ID
      const order = await OrderModel.findById(orderId);
      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      // Update the order status to 'received' and set the feedback
      order.status = "received";
      order.feedback = {
        text: feedbackText,
        points: feedbackPoints,
        from: { _id: req.user._id as string, username: req.user.username } // Include the user who submitted the feedback
      };
  
      await order.save();
  
      res.status(200).json({ message: "Feedback submitted successfully", order });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).json({ message: "Failed to submit feedback", error });
    }
  }
  
  async confirmPayment (req, res) {
    const { orderId } = req.params;
  
    try {
      // Find the order by ID and update the status to "payed"
      const order = await OrderModel.findByIdAndUpdate(
        orderId,
        { status: "payed" },
        { new: true } // This option returns the updated document
      );
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      return res.status(200).json({
        message: "Payment confirmed, order marked as payed.",
        order,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error confirming payment",
        error: error.message,
      });
    }
  };

  async setPrice(req: Request, res: Response) {
    try {
      const {orderId} = req.params;
      const {price} = req.body;
      await orderService.setPrice(orderId, price);
      res.status(200).json({});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
}();
