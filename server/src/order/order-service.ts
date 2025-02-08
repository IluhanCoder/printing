// order-service.ts
import mongoose from "mongoose";
import OrderModel, { IOrder } from "./order-model";

export default new class OrderService {
  async createOrder(credentials: any) {
    const newOrderData = {
      ...credentials,
      service: new mongoose.Types.ObjectId(credentials.service),
      processing: new mongoose.Types.ObjectId(credentials.processing)
    };
    return await OrderModel.create(newOrderData);
  }

  async fetchOrder(orderId: string): Promise<IOrder> {
    const order = await OrderModel.findById(orderId)
      // Populate orderer (from) with additional fields
      .populate("from", "_id username email cell role")
      .populate("processing", "name desc")
      .populate({
        path: "service",
        populate: [
          // Populate the executor (service.user) with additional fields
          { path: "user", select: "_id username email cell role" },
          { path: "technology", select: "name desc" },
          { path: "material", select: "name desc" }
        ]
      })
      .exec();
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<IOrder> {
    const allowedStatuses = ['pending', 'accepted', 'payed', 'sent', 'recieved'];
    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid status");
    }
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }
}();
