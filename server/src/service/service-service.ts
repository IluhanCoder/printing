import mongoose from "mongoose";
import ServiceModel, { IService, ServiceCredentials } from "./service-model";
import { ServiceSearchQuery } from "./service-types";
import DataModel from "../data/data-model";

export default new class ServiceService {
    async createService (credentials: ServiceCredentials) {
        const convertedTechnologyId = new mongoose.Types.ObjectId(credentials.technology);
        const convertedMaterialId = new mongoose.Types.ObjectId(credentials.material);

        const newService = new ServiceModel({
            ...credentials,
            material: convertedMaterialId,
            technology: convertedTechnologyId,
            images: credentials.images,
          });
    
          await newService.save();
    
          // Convert image buffers to base64 strings for easier client-side display.
          const serviceObj = newService.toObject();
          serviceObj.images = serviceObj.images.map((img: any) => ({
            data: img.data.toString('base64'),
            contentType: img.contentType,
          }));

        return serviceObj;
    }

    async getServiceDetails(id: string) {
        const service = await ServiceModel.findById(id)
            .populate("user", "_id username") // populate the creator’s username
            .populate("technology", "name desc") // populate technology name and description
            .populate("material", "name desc")   // populate material name and description
            .exec();

        if (!service) {
            throw new Error("service not found");
        }

        const serviceObj = service.toObject();
        serviceObj.images = serviceObj.images.map((img: any) => ({
        data: img.data.toString("base64"),
        contentType: img.contentType,
        }));

        return serviceObj;
    }

    async fetchServices(query) {
        const filter: any = {};

        if (query.name) {
            filter.name = { $regex: query.name, $options: "i" };
        }
        if (query.technology) {
            const technologyId = (await DataModel.find({dataType: "technology", name: {$regex: query.technology, $options: "i"}})).map((entry) => entry._id);
            filter["technology"] = technologyId[0];
        }
        if (query.material) {
            const materialId = (await DataModel.find({dataType: "material", name: {$regex: query.material, $options: "i"}})).map((entry) => entry._id);
            filter["material"] = materialId[0];
        }

        // You can limit the fields to only what is needed.
        const services: IService[] = await ServiceModel.find(filter)
        .select("name technology material images")
        .populate("technology", "name")
        .populate("material", "name")
        .exec();

        return services;
    }
}