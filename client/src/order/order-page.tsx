import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import orderService from "./order-service";
import dataService from "../data/data-service"; // Adjust the import according to your project structure

// Define the shape for order credentials
interface OrderCredentials {
  desc: string;
  processing: string;  // Selected processing id from the dropdown
  adress: string;
  file: File | null;
  service: string;     // Service id from route parameter
  budget?: number
}

// Default values for the order form
const DefaultOrderCredentials: OrderCredentials = {
  desc: "",
  processing: "",
  adress: "",
  file: null,
  service: "",
};

// Define the shape for processing options (from your Data collection)
interface ProcessingOption {
  _id: string;
  name: string;
  desc: string;
}

export default function OrderPage() {
  // Retrieve the service id from the route parameters
  const { serviceId } = useParams<{ serviceId: string }>();

  // Local state for the order form
  const [orderData, setOrderData] = useState<OrderCredentials>({
    ...DefaultOrderCredentials,
    service: serviceId || "",
  });
  
  // Local state for processing options
  const [processingOptions, setProcessingOptions] = useState<ProcessingOption[]>([]);

  // Fetch processing options from the server
  useEffect(() => {
    async function fetchProcessings() {
      try {
        // Assuming dataService.getProcessings() returns an object like { processings: ProcessingOption[] }
        const res = await dataService.getProcessings();
        setProcessingOptions(res.processings);
        if (res.processings.length > 0) {
          setOrderData(prev => ({ ...prev, processing: res.processings[0]._id }));
        }
      } catch (error) {
        console.error("Error fetching processing options:", error);
      }
    }
    fetchProcessings();
  }, []);

  // Handle input changes for text fields and the dropdown
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOrderData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOrderData(prev => ({ ...prev, file: e.target.files[0] }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Prepare form data to send to the server
    const formData = new FormData();
    formData.append("desc", orderData.desc);
    formData.append("processing", orderData.processing);
    formData.append("adress", orderData.adress);
    formData.append("service", orderData.service);
    formData.append("budget", orderData.budget.toString());
    if (orderData.file) {
      formData.append("file", orderData.file);
    }
    try {
      const res = await orderService.createOrder(formData);
      console.log("Order created:", res.data);
      // Optionally, redirect to a confirmation page or display a success message here.
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Order Service</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Description:
            <textarea
              name="desc"
              value={orderData.desc}
              onChange={handleChange}
              required
              style={{ width: "100%", height: "100px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Processing:
            <select
              name="processing"
              value={orderData.processing}
              onChange={handleChange}
              required
              style={{ marginLeft: "0.5rem" }}
            >
              {processingOptions.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Postal Address:
            <input
              type="text"
              name="adress"
              value={orderData.adress}
              onChange={handleChange}
              required
              style={{ width: "100%", marginTop: "0.5rem" }}
            />
          </label>
        </div>
        <div>
          <label>
            Budget
            <input type="number" name="budget" onChange={handleChange} defaultValue={undefined}/>
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Upload 3D Model File:
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              accept=".stl,.obj,.3mf,.jpg"
              required
              style={{ marginTop: "0.5rem" }}
            />
          </label>
        </div>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}
