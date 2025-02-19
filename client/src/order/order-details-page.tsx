import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

  const navigate = useNavigate();

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
      link.download = `uploaded_file`;
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
      alert("Ціну успішно встановлено");
      await fetchOrder();
    } catch (error) {
      console.error("Failed to set price", error);
    }
  }

  const openChat = () => {
    navigate(`/chat/${order.from._id}/${order.service.user._id}/${order.service._id}`);
  };

  if (!order) return <div className="flex w-full p-24 justify-center">Loading order details...</div>;

  const getStatusColor = (status: string) => {
    switch(status) {
      case "pending": return "text-yellow-500"; // Yellow
      case "accepted": return "text-green-600"; // Green
      case "money_sent": return "text-blue-800"; // Blue
      case "payed": return "text-orange-500"; // Orange
      case "sent": return "text-green-700"; // Success Green
      case "received": return "text-gray-500"; // Gray
      default: return "text-red-600"; // Red for unknown
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-semibold">Інформація про замовлення #{order._id}</h1>

      {/* Order Status Update */}
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

      {/* Grid for compact layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Information */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Деталі</h2>
          <p><strong>Опис:</strong> {order.desc}</p>
          <p><strong>Адреса отримувача:</strong> {order.adress}</p>
          <p><strong>Створенно:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Останнє оновлення:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
        </div>

        {/* Orderer Information */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Замовник</h2>
          <p><strong>Імʼя:</strong> {order.from.username}</p>
          <p><strong>Email:</strong> {order.from.email}</p>
          <p><strong>Номер телефону:</strong> {order.from.cell}</p>
        </div>

        {/* Processing Information */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Післядрукарська обробка</h2>
          <p><strong>Назва:</strong> {order.processing.name}</p>
          <p><strong>Опис:</strong> {order.processing.desc}</p>
        </div>

        {/* Service Information */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Інформація про послугу</h2>
          <p><strong>Назва:</strong> {order.service.name}</p>
          <p><strong>Опис:</strong> {order.service.desc}</p>
          <p><strong>Технологія:</strong> {order.service.technology.name} - {order.service.technology.desc}</p>
          <p><strong>Матеріал:</strong> {order.service.material.name} - {order.service.material.desc}</p>
        </div>

        {/* Executor Information */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Надавач послуги</h2>
          <p><strong>Імʼя:</strong> {order.service.user.username}</p>
          <p><strong>Email:</strong> {order.service.user.email}</p>
          <p><strong>Телефон:</strong> {order.service.user.cell}</p>

          {/* Conditionally render executor's card number */}
          {order.status === "accepted" && currentUserId === order.from._id && (
            <div>
              <h3 className="mt-2 text-lg font-semibold">Номер карти постачальника</h3>
              <p><strong>Номер карти:</strong> {order.service.user.cardNumber}</p>
            </div>
          )}
        </div>
      </div>

      <hr className="my-4" />

      {/* Payment Confirmation */}
      {order.status === "accepted" && currentUserId === order.service.user._id && (
        <button 
          onClick={handlePaymentConfirmation} 
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
        >
          Підтвердити отримання грошей
        </button>
      )}

      {/* Set Price Section */}
      {order.status === "pending" && currentUserId === order.service.user._id && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          {order.budget && <div>{`бюджет замовника: ${order.budget} грн`}</div>}
          <input 
            min={0} 
            type="number" 
            defaultValue={order.price ?? 0} 
            onChange={(e) => setPriceInput(Number(e.target.value))}
            className="mt-2 p-2 border rounded-md w-full"
          />
          <div className="flex justify-center">
          <button 
            type="button" 
            onClick={handleSetPrice}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600"
          >
            Встановити ціну
          </button>
          </div>
        </div>
      )}

      <hr className="my-4" />

      {/* File Download */}
      <div className="flex justify-center">
        <button 
          onClick={downloadFile} 
          className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600"
        >
          Завантажити файл для друку
        </button>
      </div>

      <hr className="my-4" />

      <div className="flex justify-center">
      <button
          onClick={openChat}
          className="py-2 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          Відкрити чат
        </button>
        </div>

      <hr className="my-4" />

      {/* Feedback Form for "received" orders */}
      {order.status === "received" && currentUserId === order.from._id && (
        <FeedbackForm orderId={order._id} onSuccess={handleFeedbackSuccess} />
      )}
    </div>
  );
}
