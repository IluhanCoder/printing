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
    <div style={{ padding: "1rem" }}>
      <h1>Your Orders</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
        {orders.map((order) => (
          <div key={order._id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h2>{order.service.name}</h2>
            <p><strong>Technology:</strong> {order.service.technology.name}</p>
            <p><strong>Material:</strong> {order.service.material.name}</p>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {order.status}</p>
            {order.from._id === userId ? (
              <p><strong>Executor:</strong> {order.service.user.username}</p>
            ) : (
              <p><strong>Orderer:</strong> {order.from.username}</p>
            )}
            <button onClick={() => handleNavigate(order._id)} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
              View Order Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
