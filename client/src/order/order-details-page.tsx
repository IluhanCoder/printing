// OrderDetailsPage.tsx
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import OrderStatusUpdate from "./OrderStatusUpdate";
import { AuthContext } from "../auth/auth-context";

// Update the interface to include extra fields for orderer and executor
interface OrderDetails {
  _id: string;
  desc: string;
  adress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  file: { data: number[]; contentType: string };
  from: { _id: string; username: string; email: string; cell: string; role: string };
  processing: { _id: string; name: string; desc: string };
  service: {
    _id: string;
    name: string;
    desc: string;
    user: { _id: string; username: string; email: string; cell: string; role: string };
    technology: { _id: string; name: string; desc: string };
    material: { _id: string; name: string; desc: string };
  };
}

const arrayBufferToBase64 = (buffer: any): string => {
  const byteArray = new Uint8Array(buffer);
  let binary = "";
  byteArray.forEach((byte) => (binary += String.fromCharCode(byte)));
  return window.btoa(binary);
};

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  
  // Get the current user's ID from the AuthContext (adjust as needed)
  const { userId: currentUserId } = useContext(AuthContext);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await api.get(`/order/${orderId}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Failed to fetch order details", error);
      }
    }
    fetchOrder();
  }, [orderId]);

  const downloadFile = () => {
    if (order && order.file && order.file.data) {
      // Extract nested data if needed
      const binaryData =
        typeof order.file.data === "object" && (order.file.data as any).data
          ? (order.file.data as any).data
          : order.file.data;
      const base64Str = arrayBufferToBase64(binaryData);
      const dataUrl = `data:${order.file.contentType};base64,${base64Str}`;
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "uploaded_file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!order) return <div>Loading order details...</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Order Details</h1>
      <p><strong>Description:</strong> {order.desc}</p>
      <p><strong>Address:</strong> {order.adress}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p>
        <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}
      </p>
      <hr />
      <h2>Orderer Information</h2>
      <p><strong>Username:</strong> {order.from.username}</p>
      <p><strong>Email:</strong> {order.from.email}</p>
      <p><strong>Cell:</strong> {order.from.cell}</p>
      <p><strong>Role:</strong> {order.from.role}</p>
      <hr />
      <h2>Processing Information</h2>
      <p><strong>Name:</strong> {order.processing.name}</p>
      <p><strong>Description:</strong> {order.processing.desc}</p>
      <hr />
      <h2>Service Information</h2>
      <p><strong>Service Name:</strong> {order.service.name}</p>
      <p><strong>Service Description:</strong> {order.service.desc}</p>
      <p>
        <strong>Technology:</strong> {order.service.technology.name} - {order.service.technology.desc}
      </p>
      <p>
        <strong>Material:</strong> {order.service.material.name} - {order.service.material.desc}
      </p>
      <hr />
      <h2>Executor (Service Creator) Information</h2>
      <p><strong>Username:</strong> {order.service.user.username}</p>
      <p><strong>Email:</strong> {order.service.user.email}</p>
      <p><strong>Cell:</strong> {order.service.user.cell}</p>
      <p><strong>Role:</strong> {order.service.user.role}</p>
      <hr />
      <button onClick={downloadFile}>Download Uploaded File</button>
      <hr />
      {/* Render the status update component */}
      <OrderStatusUpdate
        orderId={order._id}
        currentStatus={order.status}
        onStatusUpdated={(newStatus) => setOrder({ ...order, status: newStatus })}
        currentUserId={currentUserId}  // from your auth mechanism
        ordererId={order.from._id}
        executorId={order.service.user._id}
      />
    </div>
  );
}
