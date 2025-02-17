import { useState } from 'react';
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
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h3 className="text-2xl font-semibold text-center text-gray-700">Leave Feedback</h3>
      
      {/* Feedback Text Area */}
      <textarea
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        placeholder="Write your feedback here..."
        className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Rating Section */}
      <div className="flex items-center space-x-2">
        <label htmlFor="rating" className="font-medium text-gray-600">Rating:</label>
        <input
          type="number"
          value={feedbackPoints}
          onChange={(e) => setFeedbackPoints(Number(e.target.value))}
          min="1"
          max="5"
          id="rating"
          className="w-16 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-600">/5</span>
      </div>

      {/* Submit Button */}
      <div className='flex justify-center'>
        <button
          onClick={submitFeedback}
          className="px-3 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;
