import { useState } from "react";
import { DataCredentials, DataTypeOption, DataTypeOptions, DefaultDataCredentials } from "./data-types";
import handleFieldChange from "../helpers/handle-field-change";
import dataService from "./data-service";

export default function NewDataPage() {
    const [formData, setFormData] = useState<DataCredentials>(DefaultDataCredentials);
    const [error, setError] = useState<string>("");

    const handleChange = (e) => {
        handleFieldChange<DataCredentials>(e, formData, setFormData);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dataService.createData(formData);
        } catch (error) {
            setError(error.message);
        }
    }

    return <div>
        <form onSubmit={handleSubmit}>
            <div>
                <input defaultValue={formData.name} name="name" onChange={handleChange}/>
            </div>
            <div>
                <input defaultValue={formData.desc} name="desc" onChange={handleChange}/>
            </div>
            <div>
                <select defaultValue={formData.dataType} name="dataType" onChange={handleChange}>
                    {
                        DataTypeOptions.map((entry: DataTypeOption) => <option value={entry.value}>
                            {entry.label}
                        </option>)
                    }
                </select>
            </div>
            <div>
                <button type="submit">створити</button>
            </div>
        </form>
        {error && <div>
            {error}
        </div>}
    </div>
}