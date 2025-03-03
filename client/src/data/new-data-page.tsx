import { useState } from "react";
import { DataCredentials, DataTypeOption, DataTypeOptions, DefaultDataCredentials } from "./data-types";
import handleFieldChange from "../helpers/handle-field-change";
import dataService from "./data-service";

export default function NewDataPage() {
  const [formData, setFormData] = useState<DataCredentials>(DefaultDataCredentials);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    handleFieldChange<DataCredentials>(e, formData, setFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dataService.createData(formData);
      alert("Інформацію успішно додано");
      setFormData({...DefaultDataCredentials});
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-semibold mb-6">Додання інформації про матеріал/технологію/обробку</h1>
      <form key={formData.dataType} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Назва</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Опис</label>
          <input
            type="text"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Тип</label>
          <select
            name="dataType"
            value={formData.dataType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {DataTypeOptions.map((entry: DataTypeOption) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Створити
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
