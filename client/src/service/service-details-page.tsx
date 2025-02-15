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
  user: { _id: string; username: string };
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
    <div>
      <h1>{service.name}</h1>
      <p>{service.desc}</p>
      <h2>Provider: {service.user.username}</h2>
      <div>
        <h3>Technology</h3>
        <p>
          <strong>Name:</strong> {service.technology.name}
        </p>
        <p>
          <strong>Description:</strong> {service.technology.desc}
        </p>
      </div>
      <div>
        <h3>Material</h3>
        <p>
          <strong>Name:</strong> {service.material.name}
        </p>
        <p>
          <strong>Description:</strong> {service.material.desc}
        </p>
      </div>

      {galleryImages.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Uploaded Images</h2>
          <ImageGallery items={galleryImages} />
        </div>
      )}

      <button onClick={openChat}>Chat with Service Executor</button>

      {currentUserId && currentUserId !== service.user._id && (
        <div style={{ marginTop: "20px" }}>
          <Link to={`/order/${serviceId}`}>
            <button>Order This Service</button>
          </Link>
        </div>
      )}

      {/* Feedbacks Section */}
      <div style={{ marginTop: "40px" }}>
        <h2>Feedbacks</h2>
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback, index) => (
            <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
              <p><strong>{feedback.from.username}</strong> rated: {feedback.feedback.points}/5</p>
              <p>{feedback.feedback.text}</p>
            </div>
          ))
        ) : (
          <p>No feedback available for this service yet.</p>
        )}
      </div>
    </div>
  );
}
