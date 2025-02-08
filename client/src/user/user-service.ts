import api from "../api";
import { RegistrationCredentials } from "../auth/auth-service";

export default new class userService {
    async createSpecialist(credentials: RegistrationCredentials) {
        return (await api.post("/user/specialist", credentials)).data;
    }

    async getCurrentUserId() {
        return (await api.get("/user/id")).data;
    }
}