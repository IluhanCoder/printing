import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/auth-context";

interface UploadedImage {
  original: string;
  thumbnail: string;
}

interface ServiceDetails {
  name: string;
  desc: string;
  user: { _id: string; username: string, cell: string, email: string };
  technology: { name: string; desc: string };
  material: { name: string; desc: string };
  images: { data: string; contentType: string }[];
}

interface Feedback {
  feedback: {text: string;
  points: number; }
  from: { _id: string; username: string };
}

interface ServiceDetailsPageProps {
  serviceId: string;
}

export default function ServiceDetailsPage({ serviceId }: ServiceDetailsPageProps) {
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]); // State for feedbacks

  const userContext = useContext(AuthContext);
  const currentUserId = userContext.userId;

  // Fetch Service Details and Feedbacks
  useEffect(() => {
    async function fetchService() {
      try {
        const res = await api.get(`/service/${serviceId}`);
        setService(res.data);

        // Map images to the format expected by react-image-gallery
        const gallery = res.data.images.map((img: { data: string; contentType: string }) => {
          const dataUrl = `data:${img.contentType};base64,${img.data}`;
          return { original: dataUrl, thumbnail: dataUrl };
        });
        setGalleryImages(gallery);

        // Fetch feedbacks
        const feedbackRes = await api.get(`/service/${serviceId}/feedback`);
        setFeedbacks([...feedbackRes.data.feedbacks]);
      } catch (error) {
        console.error("Failed to fetch service or feedbacks", error);
      }
    }
    fetchService();
  }, [serviceId]);

  if (!service) {
    return <div>Loading service...</div>;
  }

  const openChat = () => {
    navigate(`/chat/${currentUserId}/${service.user._id}/${serviceId}`);
  };

  return (
    <div className="py-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800">{service.name}</h1>
      <p className="mt-2 text-lg text-gray-700">{service.desc}</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Text Blocks */}
        <div>
          {/* Provider Block */}
          <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-800">Provider</h3>
            <p className="text-gray-700 mt-2">
              <strong className="font-medium">Username:</strong> {service.user.username}
            </p>
            <p className="text-gray-700 mt-2">
              <strong className="font-medium">Phone:</strong> {service.user.cell}
            </p>
            <p className="text-gray-700 mt-2">
              <strong className="font-medium">Email:</strong> {service.user.email}
            </p>
          </div>

          {/* Technology Block */}
          <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-800">Technology</h3>
            <p className="text-gray-700 mt-2">
              <strong className="font-medium">Name:</strong> {service.technology.name}
            </p>
            <p className="text-gray-700 mt-2">
              <strong className="font-medium">Description:</strong> {service.technology.desc}
            </p>
          </div>

          {/* Material Block */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">Material</h3>
            <p className="text-gray-700 mt-2">
              <strong className="font-medium">Name:</strong> {service.material.name}
            </p>
            <p className="text-gray-700 mt-2">
              <strong className="font-medium">Description:</strong> {service.material.desc}
            </p>
          </div>

          {currentUserId && currentUserId !== service.user._id && (
            <div className="flex flex-col gap-2 p-4">
            <div className="flex justify-center">
          <Link to={`/order/${serviceId}`}>
            <button className="py-2 px-10 bg-green-500 text-white text-2xl font-medium rounded-lg hover:bg-green-600 transition-colors">
              Order This Service
            </button>
          </Link>
          </div>
          <div className="flex justify-center">
          <button
          onClick={openChat}
          className="py-2 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          Chat with Service Executor
        </button>
        </div>
          </div>
        )}
        </div>

        {/* Right Side: Image Gallery */}
        {galleryImages.length > 0 && (
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Uploaded Images</h2>
            <ImageGallery items={galleryImages} />
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        
      </div>

      {/* Feedbacks Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">Feedbacks</h2>
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback, index) => (
            <div
              key={index}
              className="bg-white p-4 mt-4 rounded-lg shadow-md"
            >
              <p className="text-lg font-semibold">{feedback.from.username}</p>
              <p className="text-gray-600">Rated: {feedback.feedback.points}/5</p>
              <p className="mt-2 text-gray-700">{feedback.feedback.text}</p>
            </div>
          ))
        ) : (
          <p className="mt-4 text-gray-600">No feedback available for this service yet.</p>
        )}
      </div>
    </div>
  );
}
