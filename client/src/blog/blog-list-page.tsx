import { useEffect, useState } from "react";
import { Blog } from "./blog-types";
import blogService from "./blog-service";
import { Link } from "react-router-dom";

export default function BlogList() {
    const [blogs, setBlogs] = useState<Blog[]>();

    const getData = async () => {
        const result = await blogService.fetchBlogs();
        if(result.blogs)
            setBlogs([...result.blogs]);
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div>
            <div>
                <div>blogs</div>
            </div>
            <div>
                {blogs && blogs.map((blog: Blog) => <div>
                    <div>{blog.name}</div>
                    <div>{blog.content.slice(31) + "..."}</div>
                    <div>
                        <Link to={`/blog/${blog._id}`}>читати</Link>
                    </div>
                </div>)}
            </div>
        </div>
    )
}