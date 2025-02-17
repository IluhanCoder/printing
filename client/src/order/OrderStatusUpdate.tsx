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
            Accept Order
          </button>
        );
      } else {
        message = "Waiting for the service creator to accept the order.";
      }
      break;

    case "accepted":
      statusColor = "text-blue-500";
      if (currentUserId === ordererId) {
        message = (
          <>
            <p>Executor's card number: <strong>{executorCard}</strong></p>
            <p>{`Price: ${price} грн`}</p>
            <button
              className="bg-blue-500 text-white p-2 rounded mt-4"
              onClick={() => updateStatus("money_sent")}
            >
              Mark as Money Sent
            </button>
          </>
        );
      } else {
        message = "Waiting for the orderer to send the money.";
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
                Confirm Payment Received
              </button>
            ) : (
              <p>Payment has been confirmed. Awaiting next steps.</p>
            )}
          </>
        );
      } else {
        message = "Waiting for the executor to confirm payment.";
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
            Mark as Sent
          </button>
        );
      } else {
        message = "Waiting for the service creator to mark the order as sent.";
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
            Mark as Received
          </button>
        );
      } else {
        message = "Waiting for the orderer to confirm receipt.";
      }
      break;

    case "received":
      statusColor = "text-green-700";
      message = "The order has been received. No further action required.";
      break;

    default:
      statusColor = "text-gray-500";
      message = "No further status updates available.";
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-lg">
      <h3 className={`text-xl font-bold ${statusColor}`}>Update Order Status</h3>
      <div className="mt-4">
        <p className={statusColor}>{message}</p>
        {actionButton && actionButton}
      </div>
    </div>
  );
};

export default OrderStatusUpdate;
