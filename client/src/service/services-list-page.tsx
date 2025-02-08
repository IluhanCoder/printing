import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

// Define the shape of a brief service record
interface ServiceBrief {
  _id: string;
  name: string;
  technology: { name: string };
  material: { name: string };
  images: { data: number[]; contentType: string }[];
}

// Function to convert binary data (array of numbers) to base64
const arrayBufferToBase64 = (buffer: any): string => {
  const byteArray = new Uint8Array(buffer);
  let binary = "";
  byteArray.forEach((byte) => (binary += String.fromCharCode(byte)));
  return window.btoa(binary);
};

export default function ServicesListPage() {
  const [services, setServices] = useState<ServiceBrief[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [searchTechnology, setSearchTechnology] = useState<string>("");
  const [searchMaterial, setSearchMaterial] = useState<string>("");

  const fetchServices = async () => {
    try {
      const response = await api.get("/service", {
        params: {
          name: searchName,
          technology: searchTechnology,
          material: searchMaterial,
        },
      });
      console.log(response.data.services);
      setServices(response.data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [searchName, searchTechnology, searchMaterial]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Browse Services</h1>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Search by technology"
          value={searchTechnology}
          onChange={(e) => setSearchTechnology(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Search by material"
          value={searchMaterial}
          onChange={(e) => setSearchMaterial(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {services.map((service) => {
          const firstImageUrl =
            service.images.length > 0
              ? `data:${service.images[0].contentType};base64,${arrayBufferToBase64(
                  (service.images[0].data as any).data
                )}`
              : "";
          return (
            <div
              key={service._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <h2>{service.name}</h2>
              {firstImageUrl ? (
                <img
                  src={firstImageUrl}
                  alt={service.name}
                  style={{ width: "100%", height: "auto", marginBottom: "0.5rem" }}
                />
              ) : (
                <div style={{ height: "150px", backgroundColor: "#f0f0f0", marginBottom: "0.5rem" }}>
                  No Image
                </div>
              )}
              <p>
                <strong>Technology:</strong> {service.technology.name}
              </p>
              <p>
                <strong>Material:</strong> {service.material.name}
              </p>
              <Link to={`/service/${service._id}`}>
                <button style={{ marginTop: "0.5rem" }}>View Details</button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
