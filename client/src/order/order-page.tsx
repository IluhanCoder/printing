import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import orderService from "./order-service";
import dataService from "../data/data-service"; // Adjust the import according to your project structure

interface OrderCredentials {
  desc: string;
  processing: string;
  adress: string;
  file: File | null;
  service: string;
  budget?: number;
}

const DefaultOrderCredentials: OrderCredentials = {
  desc: "",
  processing: "",
  adress: "",
  file: null,
  service: "",
};

interface ProcessingOption {
  _id: string;
  name: string;
  desc: string;
}

export default function OrderPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState<OrderCredentials>({
    ...DefaultOrderCredentials,
    service: serviceId || "",
  });

  const [processingOptions, setProcessingOptions] = useState<ProcessingOption[]>([]);

  useEffect(() => {
    async function fetchProcessings() {
      try {
        const res = await dataService.getProcessings();
        setProcessingOptions(res.processings);
        if (res.processings.length > 0) {
          setOrderData((prev) => ({ ...prev, processing: res.processings[0]._id }));
        }
      } catch (error) {
        console.error("Error fetching processing options:", error);
      }
    }
    fetchProcessings();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOrderData((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("desc", orderData.desc);
    formData.append("processing", orderData.processing);
    formData.append("adress", orderData.adress);
    formData.append("service", orderData.service);
    formData.append("budget", orderData.budget?.toString() || "0");
    if (orderData.file) {
      formData.append("file", orderData.file);
    }
    try {
      const res = await orderService.createOrder(formData);
      console.log("Order created:", res.data);
      alert("замовлення успішно розміщенно");
      navigate("/order-list");
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Замовлення послуги</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Опис:
          </label>
          <textarea
            name="desc"
            value={orderData.desc}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            placeholder="Введіть опис вашого замовлення"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Обробка:
          </label>
          <select
            name="processing"
            value={orderData.processing}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          >
            {processingOptions.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Поштова адреса:
          </label>
          <input
            type="text"
            name="adress"
            value={orderData.adress}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Введіть вашу адресу"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Бюджет:
          </label>
          <input
            type="number"
            name="budget"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Введіть бюджет"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Завантажте файл 3D моделі:
          </label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            accept=".7z,.rar,.zip,.stl,.obj,.3mf,.jpg"
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700"
          >
            Розмістити замовлення
          </button>
        </div>
      </form>
    </div>
  );
}
