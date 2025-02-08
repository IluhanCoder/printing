import { Request, Response } from "express";
import serviceService from "./service-service";
import { ExtendedRequest } from "../auth/auth-middleware";
import { ServiceSearchQuery } from "./service-types";

export default new class ServiceController {
    async createService(req: ExtendedRequest, res: Response) {
        try {
            if(!req.user) {
                throw new Error("unauthorised");
            }
            const credentials = { ...req.body, user: req.user._id };
            
            const files = req.files as Express.Multer.File[];
            const images = files.map(file => ({
                data: file.buffer,        // Make sure file.buffer exists (using memoryStorage)
                contentType: file.mimetype,
            }));

            await serviceService.createService({ ...credentials, images });

            res.status(200).json({message: "success"});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    async getServiceDetails(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const serviceObj = await serviceService.getServiceDetails(id);
            res.status(200).json(serviceObj);
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    async fetchServices(req: Request, res: Response) {
        try {
            const query = req.query;
            const services = await serviceService.fetchServices(query);
            res.status(200).json({services});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }
}