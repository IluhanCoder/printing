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
}

const OrderStatusUpdate: React.FC<OrderStatusUpdateProps> = ({
  orderId,
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
      const res = await api.patch(`/order/${orderId}/status`, { status: newStatus });
      onStatusUpdated(res.data.order.status);
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  let actionButton = null;
  let message: React.ReactNode = ""; // Change from string to React.ReactNode

  if (currentStatus === "pending") {
    if (currentUserId === executorId) {
      actionButton = (
        <button onClick={() => updateStatus("accepted")}>Accept Order</button>
      );
    } else {
      message = "Waiting for the service creator to accept the order.";
    }
  } else if (currentStatus === "accepted") {
    if (currentUserId === ordererId) {
      message = (
        <>
          <p>Executor's card number: <strong>{executorCard}</strong></p>
          <button onClick={() => updateStatus("money_sent")}>
            Mark as Money Sent
          </button>
        </>
      );
    } else {
      message = "Waiting for the orderer to send the money.";
    }
  } else if (currentStatus === "money_sent") {
    if (currentUserId === executorId) {
      actionButton = (
        <>
          {!paymentConfirmed ? (
            <button
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
  } else if (currentStatus === "payed") {
    if (currentUserId === executorId) {
      actionButton = (
        <button onClick={() => updateStatus("sent")}>Mark as Sent</button>
      );
    } else {
      message = "Waiting for the service creator to mark the order as sent.";
    }
  } else if (currentStatus === "sent") {
    if (currentUserId === ordererId) {
      actionButton = (
        <button onClick={() => updateStatus("received")}>
          Mark as Received
        </button>
      );
    } else {
      message = "Waiting for the orderer to confirm receipt.";
    }
  } else {
    message = "No further status updates available.";
  }

  return (
    <div>
      <h3>Update Order Status</h3>
      {actionButton ? actionButton : <p>{message}</p>}
    </div>
  );
};

export default OrderStatusUpdate;
