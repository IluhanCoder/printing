import React from "react";
import api from "../api";

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: string;
  onStatusUpdated: (newStatus: string) => void;
  currentUserId: string;
  ordererId: string;   // id of the user who made the order
  executorId: string;  // id of the service creator (executor)
}

const OrderStatusUpdate: React.FC<OrderStatusUpdateProps> = ({
  orderId,
  currentStatus,
  onStatusUpdated,
  currentUserId,
  ordererId,
  executorId,
}) => {
  const updateStatus = async (newStatus: string) => {
    try {
      const res = await api.patch(`/order/${orderId}/status`, { status: newStatus });
      onStatusUpdated(res.data.order.status);
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  let actionButton = null;
  let message = "";

  if (currentStatus === "pending") {
    if (currentUserId === executorId) {
      actionButton = (
        <button onClick={() => updateStatus("accepted")}>
          Accept Order
        </button>
      );
    } else {
      message = "Waiting for the service creator to accept the order.";
    }
  } else if (currentStatus === "accepted") {
    if (currentUserId === ordererId) {
      actionButton = (
        <button onClick={() => updateStatus("payed")}>
          Mark as Payed
        </button>
      );
    } else {
      message = "Waiting for the orderer to mark the order as payed.";
    }
  } else if (currentStatus === "payed") {
    if (currentUserId === executorId) {
      actionButton = (
        <button onClick={() => updateStatus("sent")}>
          Mark as Sent
        </button>
      );
    } else {
      message = "Waiting for the service creator to mark the order as sent.";
    }
  } else if (currentStatus === "sent") {
    if (currentUserId === ordererId) {
      actionButton = (
        <button onClick={() => updateStatus("recieved")}>
          Mark as Recieved
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
