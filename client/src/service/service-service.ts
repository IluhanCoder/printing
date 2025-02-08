import api from "../api";
import { ServiceCredentials } from "./service-types";

export default new class ServiceService {
  async createService (credentials: ServiceCredentials) {
    // Ensure that the required fields are provided
    if (!credentials.technology || !credentials.material || credentials.images.length === 0) {
      return;
    }

    const formData = new FormData();
    formData.append('name', credentials.name);
    formData.append('desc', credentials.desc);
    formData.append('technology', credentials.technology);
    formData.append('material', credentials.material);
    // Append each image file
    credentials.images.forEach(image => formData.append('images', image));

    try {
      return await api.post('/service', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      console.error(error);
      alert('Failed to create service');
    }
  }
}();
