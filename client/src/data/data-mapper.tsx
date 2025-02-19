import { useContext, useState } from "react";
import { Data } from "./data-types";
import { AuthContext } from "../auth/auth-context";

interface LocalParams {
  data: Data[];
  onDelete: (dataId: string) => Promise<void>;
}

export default function DataMapper({ data, onDelete }: LocalParams) {
  const [filteredData, setFilteredData] = useState<Data[]>(data);

  const updateFilteredData = (input: string) => {
    if (input.length === 0) {
      setFilteredData([...data]);
      return;
    }

    const filteredArray = data.filter((entry: Data) =>
      entry.name.toUpperCase().includes(input.toUpperCase())
    );
    setFilteredData([...filteredArray]);
  };

  const context = useContext(AuthContext);
  const user_role = context.userRole;

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          onChange={(e) => updateFilteredData(e.target.value)}
          placeholder="Search data..."
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Data List */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredData.map((entry: Data) => (
          <div
            key={entry._id}
            className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow"
          >
            {/* Entry Name */}
            <div className="text-xl font-semibold text-gray-900 mb-2">
              {entry.name}
            </div>
            
            {/* Entry Description */}
            <div className="text-gray-700 mb-4">{entry.desc}</div>

            {/* Admin Controls - Only visible if the user is an admin */}
            {user_role === "admin" && (
              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={() => onDelete(entry._id)}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
