import { Router } from "express";
import blogController from "./blog-controller";
import multer from "multer";

const blogRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

blogRouter.post("/", upload.array("images"), blogController.createBlog);
blogRouter.delete("/:id", blogController.deleteById);
blogRouter.get("/:id", blogController.getById);
blogRouter.get("/", blogController.fetchBlogs);

export default blogRouter;