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
    <div className="p-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Browse Services</h1>
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Search by technology"
          value={searchTechnology}
          onChange={(e) => setSearchTechnology(e.target.value)}
          className="w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Search by material"
          value={searchMaterial}
          onChange={(e) => setSearchMaterial(e.target.value)}
          className="w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">{service.name}</h2>
              {firstImageUrl ? (
                <img
                  src={firstImageUrl}
                  alt={service.name}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 mb-4 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <p className="text-sm text-gray-600 mb-2">
                <strong className="font-medium">Technology:</strong> {service.technology.name}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong className="font-medium">Material:</strong> {service.material.name}
              </p>
              <Link to={`/service/${service._id}`}>
                <button className="w-full py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
                  View Details
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
