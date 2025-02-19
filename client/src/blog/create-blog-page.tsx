import { ChangeEvent, useState } from "react";
import { BlogCredentials, DefaultBlogCredentials } from "./blog-types";
import handleFieldChange from "../helpers/handle-field-change";
import blogService from "./blog-service";
import ReactImageGallery from "react-image-gallery";
import { useNavigate } from "react-router";

// Define the type for preview images
interface UploadedImage {
  original: string;
  thumbnail: string;
}

export default function NewBlogPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BlogCredentials>(
    DefaultBlogCredentials
  );
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);

  const handleChange = (e) => {
    handleFieldChange<BlogCredentials>(e, formData, setFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await blogService.createBlog(formData);
    alert("статтю успішно додано!");
    navigate("/blog-list");
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Append the new file to the existing array of files
      setFormData((prev) => ({ ...prev, images: [...prev.images, file] }));

      // Create an object URL for previewing the image
      const imageUrl = URL.createObjectURL(file);
      setGalleryImages((prev) => [
        ...prev,
        { original: imageUrl, thumbnail: imageUrl },
      ]);

      // Optionally clear the file input (so the same file can be selected again if needed)
      e.target.value = "";
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Створення статті</h1>

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        {/* Blog Name Input */}
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-700">
            Назва:
          </label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Blog Content Textarea */}
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-700">
            Зміст:
          </label>
          <textarea
            name="content"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image Upload Input */}
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-700">
            Завантажити Зображення:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Створити статтю
          </button>
        </div>
      </form>

      {/* Image Gallery */}
      {galleryImages.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Завантажнні зобрежання</h2>
          <ReactImageGallery items={galleryImages} />
        </div>
      )}
    </div>
  );
}
