import api from "../api";
import { Blog, BlogCredentials } from "./blog-types";

export default new class BlogService {
    async createBlog(credentials: BlogCredentials) {
        if(!credentials.name || !credentials.content) {
            return;
        }

        const formData = new FormData();
        formData.append("name", credentials.name);
        formData.append("content", credentials.content);
        
        credentials.images.forEach(image => formData.append('images', image));

        try {
            return await api.post("/blog", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              });
        } catch (error) {
            console.log(error);
            alert("error");
        }
    }

    async deleteById(id: string) {
        try {
            await api.delete(`/blog/${id}`);
        } catch (error) {
            console.log(error);
            alert("error");
        }
    }

    async getById(id: string) {
        try {
            return (await api.get(`/blog/${id}`)).data
        } catch (error) {
            console.log(error);
            alert("error");
        }
    }

    async fetchBlogs(): Promise<{blogs: Blog[]}> {
        try {
            return (await api.get("/blog")).data
        } catch (error) {
            console.log(error);
            alert("error");
        }
    }
}