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
    <div>
      <h1>Create Printing Service</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Service Name:</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="desc"
            onChange={handleChange}
            required
          />
        </div>
        {technologyOptions &&
            <select value={formData.technology} onChange={(e) => setFormData({...formData, technology: e.target.value})}>
                {technologyOptions.map((entry: Data) => <option value={entry._id}>
                    {entry.name}
                </option>)}
            </select>
        }
        {materialOptions && <div>
            <select value={formData.material} onChange={(e) => setFormData({...formData, technology: e.target.value})}>
                {materialOptions.map((entry: Data) => <option value={entry._id}>
                    {entry.name}
                </option>)}
            </select>
        </div>}
        <div>
          <label>Upload Image:</label>
          {/* Remove "multiple" to allow adding images one at a time */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">Create Service</button>
      </form>

      {galleryImages.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Uploaded Images</h2>
          <ImageGallery items={galleryImages} />
        </div>
      )}
    </div>
  );
}
