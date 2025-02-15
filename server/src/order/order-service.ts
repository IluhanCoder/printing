// order-service.ts
import mongoose from "mongoose";
import OrderModel, { IOrder, OrderResponse } from "./order-model";
import ServiceModel, { IService } from "../service/service-model";
import { IData } from "../data/data-model";
import { IUser } from "../user/user-model";

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
          { path: "user", select: "_id username email cell role cardNumber" },
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
    const allowedStatuses = ['pending', 'accepted', 'money_sent','payed', 'sent', 'received'];
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

  async fetchOrdersForUser(userId: string): Promise<OrderResponse[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
  
    const servicesByUser = await ServiceModel.find({ user: userObjectId }).distinct("_id");
  
    const orders = await OrderModel.find({
      $or: [{ from: userObjectId }, { service: { $in: servicesByUser } }]
    })
      .populate<{ service: IService }>("service")
      .populate<{ processing: IData }>("processing")
      .populate<{ from: IUser }>("from")
      .lean();
  
    return orders.map(order => ({
      ...order,
      service: order.service as IService,
      processing: order.processing as IData,
      from: order.from as IUser,
    })) as OrderResponse[];
  }
}();
