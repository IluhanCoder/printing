import { useEffect, useState } from "react";
import { Data } from "./data-types";
import dataService from "./data-service";
import DataMapper from "./data-mapper";

export default function TechnologiesPage () {
    const [data, setData] = useState<Data[] | undefined>();

    const getData = async () => {
        const result = await dataService.getTechnologies();
        setData([...result.technologies]);
    }

    const onDelete = async (id: string) => {
        await dataService.deleteDataById(id);
        await getData();
    }

    useEffect(() => {
        getData()
    }, []);

    if (data) return <div>
        <DataMapper onDelete={onDelete} data={data}/>
    </div>
    else return <div>loading...</div>
}