import api from '../api';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
    token: string;
    role: string; // Повертаємо і роль
}

export interface RegistrationCredentials {
    username: string,
    email: string,
    cell: string,
    password: string
}

export const defaultRegistrationCredentials: RegistrationCredentials = {
    username: "",
    email: "",
    cell: "",
    password: ""
}

export default new class AuthService {
    isAuthenticated = (): boolean => {
        const token = localStorage.getItem('token');
        return !!token;
    };

    getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // Запит для перевірки токена на сервері
    validateToken = async (): Promise<boolean> => {
        try {
            await api.get('/auth/validate', {
                headers: this.getAuthHeader(),
            });
            return true;
        } catch (err) {
            return false;
        }
    };

    loginUser = async (credentials: { email: string, password: string }): Promise<{ token: string, role: string }> => {
        try {
            const response = await api.post('/auth/login', credentials);
            const token = response.data.token;

            console.log(token);

            // Збереження токена в localStorage після успішного логіну
            localStorage.setItem('token', token);

            return response.data;
        } catch (error) {
            throw error;
        }
    };

    getUserRole = (): string | null => {
        const token = localStorage.getItem('token');

        if (!token) return null;

        try {
            const decoded: { role: string } = jwtDecode(token);
            return decoded.role;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    register = async (credentials: RegistrationCredentials): Promise<any> => {
        const token = localStorage.getItem('token'); // Припустимо, токен для аутентифікації зберігається в LocalStorage

        const response = await api.post('/auth/register', credentials, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    }
}