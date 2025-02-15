import { useState } from 'react';
import axios from 'axios';
import api from '../api';

interface FeedbackFormProps {
  orderId: string;
  onSuccess: () => void; // Callback when feedback is successfully submitted
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ orderId, onSuccess }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackPoints, setFeedbackPoints] = useState(5); // Default rating of 5

  const submitFeedback = async () => {
    try {
      const response = await api.post('/order/feedback', {
        orderId,
        feedbackText,
        feedbackPoints,
      });
      console.log(response.data.message);
      onSuccess();
    } catch (error) {
      console.error('Failed to submit feedback', error);
    }
  };

  return (
    <div>
      <h3>Leave Feedback</h3>
      <textarea
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        placeholder="Write your feedback here"
      />
      <label>Rating:</label>
      <input
        type="number"
        value={feedbackPoints}
        onChange={(e) => setFeedbackPoints(Number(e.target.value))}
        min="1"
        max="5"
      />
      <button onClick={submitFeedback}>Submit Feedback</button>
    </div>
  );
};

export default FeedbackForm;
