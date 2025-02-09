import { ChangeEvent, useState } from "react";
import { BlogCredentials, DefaultBlogCredentials } from "./blog-types";
import handleFieldChange from "../helpers/handle-field-change";
import blogService from "./blog-service";
import ReactImageGallery from "react-image-gallery";

// Define the type for preview images
interface UploadedImage {
    original: string;
    thumbnail: string;
  }

export default function NewBlogPage() {
    const [formData, setFormData] = useState<BlogCredentials>(DefaultBlogCredentials);
    const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);

    const handleChange = (e) => {
        handleFieldChange<BlogCredentials>(e, formData, setFormData);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await blogService.createBlog(formData);
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          // Append the new file to the existing array of files
          setFormData(prev => ({ ...prev, images: [...prev.images, file] }));
          
          // Create an object URL for previewing the image
          const imageUrl = URL.createObjectURL(file);
          setGalleryImages(prev => [...prev, { original: imageUrl, thumbnail: imageUrl }]);
    
          // Optionally clear the file input (so the same file can be selected again if needed)
          e.target.value = "";
        }
      };

    return (
        <div>
            <h1>Creating blog</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Name: </label>
                    <input
                        type="text"
                        name="name"
                        onChange={handleChange}
                        required/>
                </div>
                <div>
                    <label>Content: </label>
                    <textarea
                        name="content"
                        onChange={handleChange}
                        required/>
                </div>
                <div>
                <label>Upload Image:</label>
                {/* Remove "multiple" to allow adding images one at a time */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                </div>
                <button type="submit">Create Blog</button>
            </form>

            {galleryImages.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                <h2>Uploaded Images</h2>
                <ReactImageGallery items={galleryImages} />
                </div>
            )}
        </div>
    )
}