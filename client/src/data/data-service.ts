import api from "../api";
import { Data, DataCredentials } from "./data-types";

export default new class DataService {
    async createData(credentails: DataCredentials) {
        return (await api.post("/data", credentails)).data;
    }

    async deleteDataById(id: string) {
        return (await api.delete(`/data/${id}`)).data;
    }

    async getMaterials(): Promise<{ materials: Data[] }> {
        return (await api.get("/data/materials")).data
    }

    async getTechnologies(): Promise<{ technologies: Data[] }> {
        return (await api.get("/data/technologies")).data
    }

    async getProcessings(): Promise<{ processings: Data[] }> {
        return (await api.get("/data/processings")).data
    }
}