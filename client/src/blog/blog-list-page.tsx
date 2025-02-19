import { useEffect, useState } from "react";
import { Blog } from "./blog-types";
import blogService from "./blog-service";
import { Link } from "react-router-dom";

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>();

  const getData = async () => {
    const result = await blogService.fetchBlogs();
    if (result.blogs) setBlogs([...result.blogs]);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-6">
      {/* Page Title */}
      <div className="mb-8 text-3xl font-bold text-gray-900">
        Blogs
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs &&
          blogs.map((blog: Blog) => (
            <div
              key={blog._id}
              className="p-6 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Blog Title */}
              <div className="text-xl font-semibold text-gray-900 mb-2">
                {blog.name}
              </div>

              {/* Blog Content Preview */}
              <div className="text-gray-700 mb-4">
                {blog.content.slice(0, 50) + "..."}
              </div>

              {/* Read More Link */}
              <div>
                <Link
                  to={`/blog/${blog._id}`}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
