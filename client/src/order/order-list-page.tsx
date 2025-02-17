import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../auth/auth-context";

// Define an interface for the orders
interface Order {
  _id: string;
  status: string;
  createdAt: string;
  service: {
    name: string;
    technology: { name: string };
    material: { name: string };
    user: { _id: string; username: string }; // Executor of the service
  };
  from: { _id: string; username: string }; // Orderer of the service
}

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { userId } = useContext(AuthContext); // Get the current user's ID from the auth context
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.get(`/order/user/${userId}`);
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    }
    fetchOrders();
  }, [userId]);

  const handleNavigate = (orderId: string) => {
    navigate(`/order-details/${orderId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Your Orders</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-blue-600">{order.service.name}</h2>
            <p className="text-gray-600"><strong>Technology:</strong> {order.service.technology.name}</p>
            <p className="text-gray-600"><strong>Material:</strong> {order.service.material.name}</p>
            <p className="text-gray-600"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className={`font-semibold ${order.status === "accepted" ? "text-yellow-500" : 
                            order.status === "payed" ? "text-blue-500" :
                            order.status === "sent" ? "text-green-500" : "text-gray-500"}`}>
              <strong>Status:</strong> {order.status}
            </p>
            {order.from._id === userId ? (
              <p className="text-gray-600"><strong>Executor:</strong> {order.service.user.username}</p>
            ) : (
              <p className="text-gray-600"><strong>Orderer:</strong> {order.from.username}</p>
            )}
            <button
              onClick={() => handleNavigate(order._id)}
              className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 focus:outline-none"
            >
              View Order Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
