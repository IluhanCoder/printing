import { useEffect, useState } from "react";
import { Blog } from "./blog-types";
import blogService from "./blog-service";
import ReactImageGallery from "react-image-gallery";
import { useParams } from "react-router";

interface UploadedImage {
    original: string;
    thumbnail: string;
  }

export default function BlogPage () {
    const {id} = useParams();

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
    }

    useEffect(() => {
        getData()
    }, []);

    return <div>
        <div>
            <h1>{blog.name}</h1>
        </div>
        {galleryImages.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Uploaded Images</h2>
          <ReactImageGallery items={galleryImages} />
        </div>
      )}
      <div>
        <p>{blog.content}</p>
      </div>
    </div>
}