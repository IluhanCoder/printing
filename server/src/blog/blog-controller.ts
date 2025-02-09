import { Request, Response } from "express";
import blogService from "./blog-service";

export default new class BlogController {
    async createBlog(req: Request, res: Response) {
        try {
            const credentials = req.body;

            const files = req.files as Express.Multer.File[];
            const images = files.map(file => ({
                data: file.buffer,        // Make sure file.buffer exists (using memoryStorage)
                contentType: file.mimetype,
            }));

            await blogService.createBlog({...credentials, images});
            res.status(200).json({});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    async deleteById(req: Request, res: Response) {
        try {
            const {id} = req.params;
            await blogService.deleteById(id);
            res.status(200).json({});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const blog = await blogService.getById(id);
            res.status(200).json({blog});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    async fetchBlogs(req: Request, res: Response) {
        try {
            const blogs = await blogService.fetchBlogs();
            res.status(200).json({blogs});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }
}