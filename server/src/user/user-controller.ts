import { ExtendedRequest } from './../auth/auth-middleware';
import { Request, Response } from "express";
import userService from "./user-service";

export default new class UserController {
    async createSpecialist (req: Request, res: Response) {
        try {
            const userData = req.body;
            const user = await userService.createSpecialist(userData);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getUserId (req: ExtendedRequest, res: Response) {
        try {
            const user = req.user;
            res.status(200).json({id: user._id});
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}