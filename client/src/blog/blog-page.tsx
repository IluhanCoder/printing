import { useEffect, useState } from "react";
import { Blog } from "./blog-types";
import blogService from "./blog-service";
import ReactImageGallery from "react-image-gallery";
import { useParams } from "react-router";

interface UploadedImage {
  original: string;
  thumbnail: string;
}

export default function BlogPage() {
  const { id } = useParams();

  const [blog, setBlog] = useState<Blog>();
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);

  const getData = async () => {
    const result = await blogService.getById(id);
    setBlog(result.blog);

    const gallery = result.blog.images.map((img: { data: string; contentType: string }) => {
      const dataUrl = `data:${img.contentType};base64,${img.data}`;
      return { original: dataUrl, thumbnail: dataUrl };
    });
    setGalleryImages(gallery);
  };

  useEffect(() => {
    getData();
  }, []);

  if (blog)
    return (
      <div className="max-w-4xl mx-auto p-8">
        {/* Blog Title */}
        <div>
          <h1 className="text-4xl font-bold mb-6">{blog.name}</h1>
        </div>

        {/* Image Gallery */}
        {galleryImages.length > 0 && (
          <div className="mt-8">
            <ReactImageGallery items={galleryImages} />
          </div>
        )}

        {/* Blog Content */}
        <div className="mt-8">
          <p className="text-lg text-gray-700">{blog.content}</p>
        </div>
      </div>
    );
  else return <div className="text-center mt-8">Loading...</div>;
}
