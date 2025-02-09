import BlogModel, { BlogCredentials } from "./blog-model";

export default new class BlogService {
    async createBlog(credentials: BlogCredentials) {
        await BlogModel.create(credentials);
    }

    async deleteById(id: string) {
        await BlogModel.findByIdAndDelete(id);
    }

    async getById(id: string) {
        const blog = await BlogModel.findById(id);
        if (!blog) {
            throw new Error("blog not found");
        }
        const blogObj = blog.toObject();
        blogObj.images = blogObj.images.map((img: any) => ({
        data: img.data.toString("base64"),
        contentType: img.contentType,
        }));

        return blogObj;
    }

    async fetchBlogs() {
        return await BlogModel.find();
    }
}