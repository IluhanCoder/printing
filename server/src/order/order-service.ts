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

  async fetchOrdersForUser(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
  
    // Find all services by the user
    const servicesByUser = await ServiceModel.find({ user: userObjectId }).distinct("_id");
  
    // Fetch the orders where the user is either the creator or the service executor
    const orders: any[] = await OrderModel.find({
      $or: [{ from: userObjectId }, { service: { $in: servicesByUser } }]
    })
      .populate<{ service: IService }>("service")
      .populate({
        path: "service", 
        populate: [
          { path: "technology", model: "Data" },
          { path: "material", model: "Data" },
          { 
            path: "user", 
            model: "User", 
            select: "_id username email cell role cardNumber" // Ensure cardNumber and other fields are selected
          },
        ]
      })
      .populate<{ processing: IData }>("processing")
      .populate<{ from: IUser }>("from", "_id username email cell role") // Populate user details properly
      .lean();

      console.log(orders);
  
    return orders.map(order => ({
      _id: order._id,
      desc: order.desc,
      adress: order.adress,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      file: order.file ? {
        data: order.file.data, 
        contentType: order.file.contentType
      } : null,
      from: {
        _id: order.from._id,
        username: order.from.username,
        email: order.from.email,
        cell: order.from.cell,
        role: order.from.role,
      },
      processing: {
        _id: order.processing._id,
        name: order.processing.name,
        desc: order.processing.desc,
      },
      service: {
        _id: order.service._id,
        name: order.service.name,
        desc: order.service.desc,
        user: {
          _id: order.service.user._id,
          username: order.service.user.username,
          email: order.service.user.email,
          cell: order.service.user.cell,
          role: order.service.user.role,
          cardNumber: order.service.user.cardNumber, // Ensure cardNumber is fetched
        },
        technology: {
          _id: order.service.technology._id,
          name: order.service.technology.name,
          desc: order.service.technology.desc,
        },
        material: {
          _id: order.service.material._id,
          name: order.service.material.name,
          desc: order.service.material.desc,
        },
      },
      price: order.price || undefined,
      budget: order.budget || undefined,
    }));
  }
  

  async setPrice(orderId: string, newPrice: number) {
    await OrderModel.findByIdAndUpdate(orderId, {price: newPrice});
  }
}();
