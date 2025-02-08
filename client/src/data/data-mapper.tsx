import { useContext, useState } from "react";
import { Data } from "./data-types";
import { AuthContext } from "../auth/auth-context";

interface LocalParams {
    data: Data[],
    onDelete: (dataId: string) => Promise<void>
}

export default function DataMapper ({data, onDelete}: LocalParams) {
    const [filteredData, setFilteredData] = useState<Data[]>(data);

    const updateFilteredData = (input: string) => {
        if(input.length === 0) {
            setFilteredData([...data]);
            return
        }
        
        const filteredArray = data.filter((entry: Data) => entry.name.toUpperCase().includes(input.toUpperCase())); 
        setFilteredData([...filteredArray]);
    }   

    const context = useContext(AuthContext);
    const user_role = context.userRole;

    return <div>
        <div>
            <input type="text" onChange={(e) => updateFilteredData(e.target.value)}/>
        </div>
        <div>
            {filteredData.map((entry: Data) => <div>
                <div>{entry.name}</div>
                <div>{entry.desc}</div>
                {user_role === "admin" && 
                <div>
                    <button type="button" onClick={() => onDelete(entry._id)}>видалити</button>
                </div>}
            </div>)}
        </div>
    </div>
}