import { Request, Response } from "express";
import dataService from "./data-service";

export default new class DataController {
    async createData(req: Request, res: Response) {
        try {
            const credentials = req.body;
            const data = await dataService.createData(credentials);
            res.status(200).json({data});
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteDataById(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const data = await dataService.deleteDataById(id);
            res.status(200).json({data});
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getMaterials(req: Request, res: Response) {
        try {
            const materials = await dataService.getMaterials();
            res.status(200).json({materials});
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getTechnologies(req: Request, res: Response) {
        try {
            const technologies = await dataService.getTechnologies();
            res.status(200).json({technologies});
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getProcessings(req: Request, res: Response) {
        try {
            const processings = await dataService.getProcessings();
            res.status(200).json({processings});
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}