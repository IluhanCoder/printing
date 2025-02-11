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
  user: { _id: string, username: string };
  technology: { name: string; desc: string };
  material: { name: string; desc: string };
  images: { data: string; contentType: string }[];
}

interface ServiceDetailsPageProps {
  serviceId: string;
}

export default function ServiceDetailsPage({ serviceId }: ServiceDetailsPageProps) {
  const navigate = useNavigate();

  const [service, setService] = useState<ServiceDetails | null>(null);
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);

  const userContext = useContext(AuthContext);
  const currentUserId = userContext.userId;

  useEffect(() => {
    console.log(currentUserId);
    async function fetchService() {
      try {
        const res = await api.get(`/service/${serviceId}`);
        console.log(res);

        setService(res.data);

        // Map images to the format expected by react-image-gallery
        const gallery = res.data.images.map((img: { data: string; contentType: string }) => {
          const dataUrl = `data:${img.contentType};base64,${img.data}`;
          return { original: dataUrl, thumbnail: dataUrl };
        });
        setGalleryImages(gallery);
      } catch (error) {
        console.error("Failed to fetch service", error);
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
      {/* Show Order button if current user is not the creator */}
      {currentUserId && currentUserId !== service.user._id && (
        <div style={{ marginTop: "20px" }}>
          <Link to={`/order/${serviceId}`}>
            <button>Order This Service</button>
          </Link>
        </div>
      )}
    </div>
    
  );
}
