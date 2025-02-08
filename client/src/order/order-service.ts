// order-service.ts (client)
import api from "../api";

export default new class OrderService {
  async createOrder(formData: FormData) {
    return await api.post("/order", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}();
