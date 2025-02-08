import { ChangeEvent } from "react";
import { RegistrationCredentials } from "../auth/auth-service";
import handleFieldChange from "../helpers/handle-field-change";

interface LocalParams {
    formData: RegistrationCredentials,
    setFormData: React.Dispatch<React.SetStateAction<RegistrationCredentials>>,
    handleSubmit: (e: React.FormEvent) => void,
    error?: string
}

export default function CreateUserForm({formData, setFormData, error, handleSubmit}: LocalParams) {
    const handleChange = (event) => {
      handleFieldChange<RegistrationCredentials>(event, formData, setFormData);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Створити нового користувача</h1>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ім'я користувача</label>
                <input
                  type="text"
                  value={formData.username}
                  name="username"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Номер телефону</label>
                <input
                  type="cell"
                  name="cell"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Створити
              </button>
            </form>
          </div>
        </div>
      );
}