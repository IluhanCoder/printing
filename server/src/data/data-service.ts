import DataModel, { DataCredentials } from "./data-model";

export default new class DataService {
    async createData (credentials: DataCredentials) {
        const newData = new DataModel(credentials);
        return await newData.save()
    }

    async deleteDataById (id: string) {
        return await DataModel.findByIdAndDelete(id);
    }

    async getMaterials () {
        const result = await DataModel.find({dataType: "material"});
        return result;
    }

    async getTechnologies () {
        const result = await DataModel.find({dataType: "technology"});
        return result;
    }

    async getProcessings () {
        const result = await DataModel.find({dataType: "processing"});
        return result;
    }
}