import React, { useState } from "react";
import api from "../api";

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: string;
  onStatusUpdated: (newStatus: string) => void;
  currentUserId: string;
  ordererId: string; // id of the user who made the order
  executorId: string; // id of the service creator (executor)
  executorCard: string; // executor's card number
  price: number | undefined;
}

const OrderStatusUpdate: React.FC<OrderStatusUpdateProps> = ({
  orderId,
  price,
  currentStatus,
  onStatusUpdated,
  currentUserId,
  ordererId,
  executorId,
  executorCard,
}) => {
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const updateStatus = async (newStatus: string) => {
    try {
      if(newStatus === "accepted" && !price) {
        alert("ви маєте встановити вартість замовлення");
        return;
      }
      const res = await api.patch(`/order/${orderId}/status`, { status: newStatus });
      onStatusUpdated(res.data.order.status);
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  let actionButton = null;
  let message: React.ReactNode = ""; // Change from string to React.ReactNode
  let statusColor = ""; // Color based on status

  switch (currentStatus) {
    case "pending":
      statusColor = "text-yellow-500";
      if (currentUserId === executorId) {
        actionButton = (
          <button
            className="bg-yellow-500 text-white p-2 rounded mt-4"
            onClick={() => updateStatus("accepted")}
          >
            Прийняти Замовлення
          </button>
        );
      } else {
        message = "Очікуйте, коли виконувач послуг прийме замовлення.";
      }
      break;

    case "accepted":
      statusColor = "text-blue-500";
      if (currentUserId === ordererId) {
        message = (
          <>
            <p>Номер карти, на який необхідно перевести кошти: <strong>{executorCard}</strong></p>
            <p>{`Вартість: ${price} грн`}</p>
            <button
              className="bg-blue-500 text-white p-2 rounded mt-4"
              onClick={() => updateStatus("money_sent")}
            >
              Позначити, що гроші відправлені
            </button>
          </>
        );
      } else {
        message = "Очікується відправлення грошей замовником.";
      }
      break;

    case "money_sent":
      statusColor = "text-yellow-400";
      if (currentUserId === executorId) {
        actionButton = (
          <>
            {!paymentConfirmed ? (
              <button
                className="bg-yellow-400 text-white p-2 rounded mt-4"
                onClick={() => {
                  setPaymentConfirmed(true);
                  updateStatus("payed");
                }}
              >
                Підтвердити отримання грошей
              </button>
            ) : (
              <p>Оплату підтвердеженно. Очікуйте здійснення замовлення.</p>
            )}
          </>
        );
      } else {
        message = "Очікуйте. Виконувач послуг має підтврердити вдалу оплату послуги.";
      }
      break;

    case "payed":
      statusColor = "text-green-500";
      if (currentUserId === executorId) {
        actionButton = (
          <button
            className="bg-green-500 text-white p-2 rounded mt-4"
            onClick={() => updateStatus("sent")}
          >
            Позначити, що виріб відправлено
          </button>
        );
      } else {
        message = "Очікується відправлення замовлення.";
      }
      break;

    case "sent":
      statusColor = "text-teal-500";
      if (currentUserId === ordererId) {
        actionButton = (
          <button
            className="bg-teal-500 text-white p-2 rounded mt-4"
            onClick={() => updateStatus("received")}
          >
            Позначити, що виріб отримано
          </button>
        );
      } else {
        message = "Очікується підтврдження, що замовник отримав виріб.";
      }
      break;

    case "received":
      statusColor = "text-green-700";
      message = "Замовлення отримано. Наступні дії відсутні.";
      break;

    default:
      statusColor = "text-gray-500";
      message = "Наступні статуси недоступні.";
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-lg">
      <h3 className={`text-xl font-bold ${statusColor}`}>Поточний статус замовлення</h3>
      <div className="mt-4">
        <p className={statusColor}>{message}</p>
        {actionButton && actionButton}
      </div>
    </div>
  );
};

export default OrderStatusUpdate;
