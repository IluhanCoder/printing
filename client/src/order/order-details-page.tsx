// OrderDetailsPage.tsx
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import OrderStatusUpdate from "./OrderStatusUpdate";
import { AuthContext } from "../auth/auth-context";
import FeedbackForm from "./feedback-form";

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
    user: {
      _id: string;
      username: string;
      email: string;
      cell: string;
      role: string;
      cardNumber: string; // Add card number field for the executor
    };
    technology: { _id: string; name: string; desc: string };
    material: { _id: string; name: string; desc: string };
  };
  price?: number,
  budget?: number
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
  const [priceInput, setPriceInput] = useState<number>(0);

  // Get the current user's ID from the AuthContext
  const { userId: currentUserId } = useContext(AuthContext);

  async function fetchOrder() {
    try {
      const res = await api.get(`/order/${orderId}`);
      setOrder({...res.data});
    } catch (error) {
      console.error("Failed to fetch order details", error);
    }
  }

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const downloadFile = () => {
    if (order && order.file && order.file.data) {
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

  const handleFeedbackSuccess = () => {
    async function refreshOrder() {
      try {
        const res = await api.get(`/order/${orderId}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Failed to refresh order details", error);
      }
    }
    refreshOrder();
  };

  const handlePaymentConfirmation = async () => {
    try {
      // Update the order status to "payed"
      const res = await api.patch(`/order/${orderId}/confirm-payment`);
      setOrder(res.data); // Update the order state after payment is confirmed
    } catch (error) {
      console.error("Failed to confirm payment", error);
    }
  };

  const handleSetPrice = async () => {
    try {
      if(order.budget && priceInput > order.budget) {
        alert("Ціна не може перевищувати бюджет замовника")
        return;
      }
      const res = await api.patch(`/order/${orderId}/price`, {price: priceInput});
      alert("ціну успішно встановлено");
      await fetchOrder();
    } catch (error) {
      console.error("Failed to set price", error);
    }
  }

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

      {/* Conditionally render card number if the order status is accepted and the current user is the orderer */}
      {order.status === "accepted" && currentUserId === order.from._id && (
        <div>
          <h3>Executor's Card Number</h3>
          <p><strong>Card Number:</strong> {order.service.user.cardNumber}</p>
        </div>
      )}

      {/* Conditionally render payment confirmation button if the current user is the executor */}
      {order.status === "accepted" && currentUserId === order.service.user._id && (
        <button onClick={handlePaymentConfirmation}>
          Confirm Payment Received
        </button>
      )}

      {order.status === "pending" && currentUserId === order.service.user._id && (
        <div>
          {order.budget && <div>
              {`бюджет замовника: ${order.budget} грн`}
            </div>}
          <input min={0} type="number" defaultValue={order.price ?? 0} onChange={(e) => setPriceInput(Number(e.target.value))}/>
          <button type="button" onClick={handleSetPrice}>
            Set Price
          </button>
        </div>
      )}

      <hr />
      <button onClick={downloadFile}>Download Uploaded File</button>
      <hr />
      <OrderStatusUpdate
        orderId={order._id}
        price={order.price}
        currentStatus={order.status}
        onStatusUpdated={(newStatus) => setOrder({ ...order, status: newStatus })}
        currentUserId={currentUserId}
        ordererId={order.from._id}
        executorId={order.service.user._id}
        executorCard={order.service.user.cardNumber}
      />
      <hr />
      {order.status === "received" && currentUserId === order.from._id && (
        <FeedbackForm orderId={order._id} onSuccess={handleFeedbackSuccess} />
      )}
    </div>
  );
}

