import BlogModel, { BlogCredentials } from "./blog-model";

export default new class BlogService {
    async createBlog(credentials: BlogCredentials) {
        await BlogModel.create(credentials);
    }

    async deleteById(id: string) {
        await BlogModel.findByIdAndDelete(id);
    }

    async getById(id: string) {
        await BlogModel.findById(id);
    }

    async fetchBlogs() {
        await BlogModel.find();
    }
}