import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import serviceService from "./service-service";
import { DefaultServiceCredentials, ServiceCredentials } from "./service-types";
import handleFieldChange from "../helpers/handle-field-change";
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { Data } from "../data/data-types";
import dataService from "../data/data-service";

// Define the type for preview images
interface UploadedImage {
  original: string;
  thumbnail: string;
}

export default function NewServicePage () {
  const [formData, setFormData] = useState<ServiceCredentials>(DefaultServiceCredentials);
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);
  
  const [technologyOptions, setTechnologyOptions] = useState<Data[] | undefined>();
  const [materialOptions, setMaterialOptions] = useState<Data[] | undefined>();

  const fetchData = async () => {
    const technologies = (await (dataService.getTechnologies())).technologies;
    const materials = (await (dataService.getMaterials())).materials;

    setTechnologyOptions([...technologies]);
    setMaterialOptions([...materials]);

    if(technologies && materials)
        setFormData({...formData, technology: technologies[0]._id, material: materials[0]._id})
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await serviceService.createService(formData);
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleFieldChange(e, formData, setFormData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Printing Service</h1>
        
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Name:</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description:</label>
            <textarea
              name="desc"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {technologyOptions && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technology:</label>
              <select
                value={formData.technology}
                onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {technologyOptions.map((entry: Data) => (
                  <option key={entry._id} value={entry._id}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {materialOptions && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material:</label>
              <select
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {materialOptions.map((entry: Data) => (
                  <option key={entry._id} value={entry._id}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Service
          </button>
        </form>

        {galleryImages.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800">Uploaded Images</h2>
            <div className="mt-4">
              <ImageGallery items={galleryImages} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
